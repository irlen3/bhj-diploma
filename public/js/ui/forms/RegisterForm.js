/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if (response) {
        this.element.reset();
        App.setState('user-logged');
        let modal; 
        modal = new Modal(document.querySelector("#modal-register"));
        modal.onClose();
      } else {
          alert(err);
      }
     });
    }
}