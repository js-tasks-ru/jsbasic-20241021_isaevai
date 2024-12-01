export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  }

  #getCartItem(productId) {
    return this.cartItems.find((item) => item.product.id == productId);
  }
}