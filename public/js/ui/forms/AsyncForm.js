/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(element) 
      this.element = element; 
    else 
      throw new Error ("Переданный элемент не существует");
    this.registerEvents();
  }

  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.addEventListener('submit', event => {
      event.preventDefault();
      this.submit();
    });
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    let massive = {};
    // const email = this.element.querySelector('[name="email"]').value;
    // const password = this.element.querySelector('[name="password"]').value;
    // const name = this.element.querySelector('[name="name"]').value;
    // massive = {name: name, email: email, password: password};
    // const form = this.element;
    // let formData  = new FormData (form);
    // let entries = formData.entries();
    // for (let item of entries) {
    for (let item of new FormData(this.element).entries()) {
      const key = item[0],
        value = item[1];
        massive[key] = value;
    }
    return massive;
  }

  onSubmit(options){

  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit() {
    this.onSubmit(this.getData());
  }
}