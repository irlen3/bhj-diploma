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
          let option ='';
          this.element.querySelector('.accounts-select').innerHTML = '';
             
            for(let i = 0; i < response.data.length; i++) {
              option += `<option value="${response.data[i].id}">${response.data[i].name}</option>`
            }
            this.element.querySelector('.accounts-select').innerHTML = option;
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
        App.getModal('newIncome').onClose();
        App.getModal('newExpense').onClose();
        this.element.reset();
        App.update();
      }
      else
        alert('Такая транзакция уже существует');
      });
  }
}