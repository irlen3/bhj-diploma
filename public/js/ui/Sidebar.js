/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    this.toggleButton = document.querySelector('.sidebar-toggle');
    this.bodyChange = document.querySelector('.sidebar-mini');
    this.toggleButton.addEventListener('click', () => {
      if(!this.bodyChange.classList.contains('sidebar-open' && 'sidebar-collapse')) {
        this.bodyChange.classList.add('sidebar-open');
        this.bodyChange.classList.add('sidebar-collapse');
      } else {
        this.bodyChange.classList.remove('sidebar-open');
        this.bodyChange.classList.remove('sidebar-collapse');
      }
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    let buttonRegister = document.querySelector(".menu-item_register");
    buttonRegister.addEventListener('click', () => {
      this.modal = App.getModal('register');
      this.modal.open();
    });

    let buttonLogin = document.querySelector(".menu-item_login");
    buttonLogin.addEventListener('click', () => {
      this.modal = App.getModal('login');
      this.modal.open();
    });

    let buttonLogout = document.querySelector(".menu-item_logout");
    buttonLogout.addEventListener('click', () => {
      let data = User.current();
      User.logout(data, (err, response) => {
        if (response) 
          App.setState('init');
      });
    });
  }
}