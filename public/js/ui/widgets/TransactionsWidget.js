/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    try {
      this.element = element;
      this.registerEvents();
    } catch (error) {
      return error;
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let buttonIncome, buttonExpense, modal;
    buttonIncome = this.element.querySelector('.create-income-button');
    buttonIncome.addEventListener('click',() => {
      modal = new Modal(document.querySelector("#modal-new-income"));
      modal.open();
    });

    buttonExpense = this.element.querySelector('.create-expense-button');
    buttonExpense.addEventListener('click',() => {
      modal = new Modal(document.querySelector("#modal-new-expense"));
      modal.open();
    });
  }
}
