/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let user = User.current();
    if(user) {
      Account.list(user, (err, response) => {
        if (response) {
          let selects;

          selects = document.querySelectorAll('.accounts-select');
          for(let select of selects) {
            while(select.lastChild) {
              select.removeChild(select.lastChild);
             }
          
            for(let i = 0; i < response.data.length; i++) {
              let option;
              option = document.createElement('option');
              option.value = response.data[i].id;
              option.text = response.data[i].name;
              select.appendChild(option);
            }
            select.selectedIndex[0];
          }
        } 
        else {
            alert(err);
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (success, response) => {
      if (response) {
        let modal; 
        this.element.closest('.modal')
        modal = new Modal(this.element.closest('.modal'));
        modal.onClose();
        this.element.reset();
        App.update();
      }
      else
        alert('Такая транзакция уже существует');
      });
  }
}