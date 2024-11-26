import createElement from "../../assets/lib/create-element.js";

export default class ProductCard {
  constructor(product) {
    this.name = product.name;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    this.id = product.id;

    this.render();
  }

  render = () => {
    this.elem = createElement(`
      <div class="card">
        <div class="card__top">
          <img src=${this.getPathImage()}
            class="card__image"
            alt="product"
          >
          <span class="card__price">€${this.getprice()}</span>
        </div>

      <div class="card__body">
        <div class="card__title">${this.name}</div>

        <button type="button" class="card__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
  `);

    this.elem.addEventListener("click", this.add);
  };

  add = (e) => {
    const isButton = e.target.closest(".card__button");

    if (isButton) {
      const eventProductAdd = new CustomEvent("product-add", {
        detail: this.id,
        bubbles: true,
      });

      this.elem.dispatchEvent(eventProductAdd);
    }
  };

  getprice = () => {
    return this.price.toFixed(2);
  };

  getPathImage = () => {
    return `/assets/images/products/${this.image}`;
  };
}