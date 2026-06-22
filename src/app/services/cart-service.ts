import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  item: CartItem[] = [];
  
  constructor() {
    const cart = localStorage.getItem('cart');
    if (cart) this.item = JSON.parse(cart);
  }

  addItem(product: Product) {
    const i = this.item.findIndex((item) => item.product.id === product.id);
    if (i === -1) {
      const newItem: CartItem = { product, quantity: 1 };
      this.item.push(newItem);
    } else {
      this.item[i].quantity += 1;
    }
    this.updateStorage();
  }

  getItems(): CartItem[] {
    return this.item;
  }

  deleteItem(productId: number) {
    this.item = this.item.filter(item => item.product.id !== productId);
    if (this.item.length === 0) {
      localStorage.removeItem('cart');
      return;
    }
    this.updateStorage();
  }

  changeQuantity(productId: number, quantity: number) {
    this.item = this.item.map(item => {
      const actualItem = item;
      if (actualItem.product.id === productId) {
        actualItem.quantity = quantity;
      }
      return actualItem;
    });
    this.updateStorage();
  }

  clearCart() {
    this.item = [];
    localStorage.removeItem('cart');
  }

  updateStorage() {
    localStorage.setItem('cart', JSON.stringify(this.item));
  }

  loadStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) this.item = JSON.parse(cart);
  }

}
