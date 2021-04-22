/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element) 
      this.element = element; 
    else 
      throw new Error ("Переданный элемент не существует");
    this.lastOptions;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
      this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if(event.target.classList.contains('remove-account')) {
        this.removeAccount(this.lastOptions.account_id);
      }

      if(event.target.classList.contains('transaction__remove')) {
        let id = event.target.getAttribute("data-id");
        this.removeTransaction(id);
      }
  
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount(id) {
        if(confirm('Вы действительно хотите удалить счёт?')) {
            Account.remove({ id: id }, (err, response) => {
            if (response) {
              this.clear();
              App.updateWidgets();
            } else {
                alert(err);
            }
          });
        } else {

        }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(id) {
      if(confirm('Вы действительно хотите удалить счёт?')) {
        Transaction.remove({ id: id }, (err, response) => {
        if (response) {
          App.update();
        } else {
            alert(err);
        }
      });
      }
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.clear();
      this.lastOptions = options;
      let id = options.account_id;
      Account.get(id, (err, response) => {
        if (response) {
          let arr, index;
          arr = Array.from(response.data);
          index = arr.findIndex(element => element.id === id);
          let name =  arr[index].name;
          this.renderTitle(name); 
       } 
      });
      Transaction.list(id, (err, response) => {
        if (response) {
          this.renderTransactions(response.data);
        } else {
            alert(err);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    document.querySelector('.content-title').innerHTML = 'Название счёта';
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').innerHTML = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate;
    newDate = new Date(date);
    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric', 
    } 
    let formattedDay = newDate.toLocaleDateString('ru-RU', options);
    let formattedTime = newDate.toLocaleTimeString('ru-RU', {hour: "numeric", minute: "numeric",});
    let formatted = formattedDay + ' в ' + formattedTime;
    return formatted;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    // account_id: "cagkmw1hxj6"
    // created_at: "2021-04-02T14:16:36.471Z"
    // id: "6ygkn0e4f3s"
    // name: "ret"
    // sum: 100
    // type: "income"
    // user_id: "1al3jh130kmgt4lcl"

    let date = this.formatDate(item.created_at); 

    let divTransaction = document.createElement('div');
    if(item.type === 'income') {
      divTransaction.classList.add('transaction', 'transaction_income', 'row');
    } else {
      divTransaction.classList.add('transaction', 'transaction_expens', 'row');
    }

    divTransaction.insertAdjacentHTML('beforeEnd', 
    `<div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${date}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>`);
    return divTransaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    for(let item = 0 ; item < data.length; item ++) {
      let code = this.getTransactionHTML(data[item]);
      document.querySelector('.content').appendChild(code);
    }
    if(data.length === 0) {
      let content = document.querySelector('.content');
      while(content.firstChild) {
        content.removeChild(content.firstChild);
      }
    }
  }
}