/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element) 
      this.element = element; 
    else 
      throw new Error ("Переданный элемент не существует");
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    let button, modal, accounts, array, childs = [];
    button = this.element.querySelector('.create-account');
    button.addEventListener('click',() => {
    App.getModal('createAccount').open();
    });

    this.element.addEventListener('click', (e) => {
      this.onSelectAccount(e.target);
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let user = User.current();
    if(user) {
      Account.list(user, (err, response) => {
        if (response) {
          this.clear();
          this.renderItem(response.data);
        } else {
            alert(err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let account, lenght;
    lenght = document.querySelectorAll('.account').length;
   
    while(lenght !== 0) {
      account = document.querySelector('.account');
      account.remove();
      lenght --;
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if(element) {
      if(document.querySelector('.active')) {
        document.querySelector('.active').classList.remove('active');
      }
      if(element.closest('.account')) {
        element.closest('.account').classList.add('active');
        // let id = document.closest('.account').dataset.dataId;
        let id = element.closest('.account').getAttribute("data-id");
        App.showPage( 'transactions', { account_id: id });
      }
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let li;
    li = document.createElement('li');
    li.classList.add('account');
    li.setAttribute("data-id", item.id);
    li.insertAdjacentHTML('beforeEnd', `<a href="#"> <span> ${item.name} </span> / <span> ${item.sum} ₽ </span> </a>`);
    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for(let item = 0 ; item < data.length; item ++) {
      let code = this.getAccountHTML(data[item]);
      this.element.appendChild(code);
    }
  }
}
