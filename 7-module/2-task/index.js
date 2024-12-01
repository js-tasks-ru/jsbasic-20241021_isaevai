import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  modal;

  constructor() {
    this.modal = this.#render();
  }

  get modal() {
    return this.modal;
  } 

  #createModal() {
    let modal = createElement(`
    <!--Корневой элемент Modal-->
    <div class="modal">
      <!--Прозрачная подложка перекрывающая интерфейс-->
      <div class="modal__overlay"></div>
  
      <div class="modal__inner">
        <div class="modal__header">
          <!--Кнопка закрытия модального окна-->
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
  
          <h3 class="modal__title">
          </h3>
        </div>
  
        <div class="modal__body">
        </div>
      </div>
  
      </div>`);

    return modal;
  }

  #render() {
    this.modal = this.#createModal();
    this.modal.querySelector('.modal__close').addEventListener('click', this.#onCloseClick);
    return this.modal;
  }

  open() {
    document.body.append(this.modal);
    document.body.classList.add("is-modal-open");
    document.body.addEventListener('keydown', this.#onEscClick);
  }

  setTitle(title) {
    this.modal.querySelector('.modal__title').textContent = title;
  }

  setBody(node) {
    this.modal.querySelector('.modal__body').innerHTML = "";
    this.modal.querySelector('.modal__body').append(node);
  }

  close() {
    this.modal.remove();
    document.body.classList.remove("is-modal-open");
    document.body.removeEventListener('keydown', this.#onEscClick);
  }

  #onCloseClick = () => {
    this.close();
  }

  #onEscClick = (event) => {
    if (event.code == 'Escape') {
      this.close();
    }
  }

}