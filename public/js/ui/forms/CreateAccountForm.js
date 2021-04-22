/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (success, response) => {
      if (response) {
        App.getModal('createAccount').onClose();
        this.element.reset();
        App.update();
      }
      else
        alert('Такой счет уже существует');
      });
  }
}