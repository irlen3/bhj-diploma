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
      if(element) 
        this.element = element; 
      else 
        throw new Error ("Переданный элемент не существует");
      this.registerEvents();
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
      App.getModal('newIncome').open();

    });

    buttonExpense = this.element.querySelector('.create-expense-button');
    buttonExpense.addEventListener('click',() => {
      App.getModal('newExpense').open();
    });
  }
}
