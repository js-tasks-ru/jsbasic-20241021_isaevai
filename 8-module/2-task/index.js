import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null;

  constructor(products) {
    this.products = products;
    this.elem = this.#render();
    this.filters = {};
  }

  get elem() {
    return this.elem;
  } 

  #createTemplate() {
    let template = createElement(`
    <div class="products-grid">
      <div class="products-grid__inner">
      </div>
    </div>`);

    return template;
  }

  #render() {
    this.elem = this.#createTemplate();
    this.#addProducts(this.products);
    return this.elem;
  }

  #addProducts(products) {
    let grid = this.elem.querySelector('.products-grid__inner');
    grid.innerHTML = '';

    products.forEach(product => {
      const productCard = new ProductCard(product);
      grid.appendChild(productCard.elem);
    });
  };

  #filterProducts() {
    return this.products.filter(product => {
      if (this.filters.noNuts && product.nuts) {
        return false;
      }
      
      if (this.filters.vegeterianOnly && !product.vegeterian) {
        return false;
      }
      
      if (this.filters.maxSpiciness && product.spiciness > this.filters.maxSpiciness) {
        return false;
      }
      
      if (this.filters.category && product.category != this.filters.category) {
        return false;
      }
      
      return true;
    });
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);
    const filteredProducts = this.#filterProducts();
    this.#addProducts(filteredProducts);
  }

}