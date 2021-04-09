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
    try {
      this.lastOptions;
      this.element = element;
      this.registerEvents();
    } catch (error) {
      return error;
    }  
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if(this.lastOptions) {
      this.render(this.lastOptions);
    } else {
      this.render();
    }
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
          let name;
          name = this.element.querySelector('.content-title').innerHTML;
          Account.list(name, (err, response) => {
            if (response) {
              let arr, index;
              arr = Array.from(response.data);
              index = arr.findIndex(element => element.name === name);
              let id =  arr[index].id;
              this.removeAccount(id);
            }
         });
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
          // let accountWidget;
          // accountWidget = new AccountsWidget(document.querySelector(".accounts-panel"));
          // accountWidget.update();
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
          Transaction.list(id, (err, response) => {
              if (response) {
                this.renderTransactions(response.data);
              } else {
                  alert(err);
              }
            });
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
    let divTransaction = document.createElement('div');
    if(item.type === 'income') {
      divTransaction.classList.add('transaction', 'transaction_income', 'row');
    } else {
      divTransaction.classList.add('transaction', 'transaction_expens', 'row');
    }
    let divDetails = document.createElement('div');
    divDetails.classList.add('col-md-7', 'transaction__details');
    divTransaction.appendChild(divDetails);
    let divIcon =  document.createElement('div');
    divIcon.classList.add('transaction__icon');
    divDetails.appendChild(divIcon);
    
    let span1 =  document.createElement('span');
    span1.classList.add('fa', 'fa-money', 'fa-2x');
    divIcon.appendChild(span1);

    let divInfo =  document.createElement('div');
    divInfo.classList.add('transaction__info');
    divDetails.appendChild(divInfo);

    divInfo.insertAdjacentHTML('beforeEnd',  '<h4 class="transaction__title">' + item.name + '</h4>');
  
    let date = this.formatDate(item.created_at); 
  
    divInfo.insertAdjacentHTML('beforeEnd',  '<div class="transaction__date">' + date + '</div>');

    let colMd3 =  document.createElement('div');
    colMd3.classList.add('col-md-3');
    divTransaction.appendChild(colMd3);

    let summ =  document.createElement('div');
    summ.classList.add('transaction__summ');
    summ.insertAdjacentHTML('beforeEnd',  item.sum + '<span class="currency">₽</span>');
    colMd3.appendChild(summ);

    let colMd2 =  document.createElement('div');
    colMd2.classList.add('col-md-2', 'transaction__controls');
    divTransaction.appendChild(colMd2);

    let button =  document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'transaction__remove');
    button.setAttribute("data-id", item.id);
    colMd2.appendChild(button);

    button.insertAdjacentHTML('beforeEnd', '<i class="fa fa-trash"></i>');
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