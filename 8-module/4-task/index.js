import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product || product === null) {
      return;
    }

    const cartItem = this.#getCartItem(product.id);

    if (!cartItem) {
      this.cartItems.push({product, count: 1})
    }
    else {
      cartItem.count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    const cartItem = this.#getCartItem(productId);

    if (!productId || !cartItem) {
      return;
    }

    cartItem.count += amount;

    if (cartItem.count <= 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length == 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((sum, cartItem) => sum + cartItem.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.count, 0);
  }

  #getCartItem(productId) {
    return this.cartItems.find((item) => item.product.id == productId);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');
    this.#renderModalBody();
    this.modal.open();
  }

  #onButtonClick = (event) => {
    const target = event.target;

    if (!event.target.closest(".cart-counter__button")) {
      return;
    }

    const productId = target.closest("[data-product-id]").dataset.productId;

    this.updateProductCount(
      productId,
      event.target.closest(".cart-counter__button_plus") ? 1 : -1
    );
  }

  #renderModalBody(){
    this.modalBody = document.createElement('div');

    this.cartItems.forEach(cartItem => {
      this.modalBody.append(this.renderProduct(cartItem.product, cartItem.count));
    });

    this.modalBody.append(this.renderOrderForm());

    this.modalBody.addEventListener('click', this.#onButtonClick);
    this.modalBody.querySelector('.cart-form').onsubmit = (event) => this.onSubmit(event);

    this.modal.setBody(this.modalBody);
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!this.modal || !document.body.classList.contains('is-modal-open')) {
      return
    }

    if (this.isEmpty()) {
      this.modal.close();
      return;
    }

    let productId = cartItem.product.id;

    if (cartItem.count == 0) {
      this.modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
    } else {
      let productCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`); 
      let productPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`); 
      let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`); 
      
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    
    this.modalBody.querySelector('button[type="submit"]').classList.add("is-loading");

    let form = this.modalBody.querySelector('.cart-form');
    let data = new FormData(form);

    await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: data,
    });

    this.modal.setTitle("Success!");
    this.modalBody.querySelector('button[type="submit"]').classList.remove("is-loading");

    this.cartItems = [];
    this.cartIcon.update(this);
    this.modalBody.innerHTML = this.#successMessageTemplate();
  };

  #successMessageTemplate() {
    return `
    <div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
       </p>
    </div>`;
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

