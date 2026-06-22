import { Component, signal } from '@angular/core';
import { CartService } from '../../../services/cart-service';
import { CartItem } from '../../../models/cart-item';
import { QuantityButton } from '../quantity-button/quantity-button';
import { WhatsappService } from '../../../services/whatsapp-service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpHandlerService } from '../../../services/http-handler.service';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-cart-component',
  imports: [QuantityButton, FormsModule, CurrencyPipe],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css',
})
export class CartComponent {

  item: CartItem[] = [];
  quantity = signal(1);
  orderNote: string = '';
  subTotal: number = 0;
  total: number = 0;
  private defaultImage = 'https://via.placeholder.com/640?text=Sin+imagen';

  constructor(
    private cartService: CartService,
    private whatsappService: WhatsappService,
    private router: Router,
    private handler: HttpHandlerService
  ) {}

  ngOnInit() {
    this.item = this.cartService.getItems();
    this.calculateDetails();
  }

  calculateDetails() {
    this.subTotal = 0;
    for (let i = 0; i < this.cartService.item.length; i++) {
      this.subTotal += this.cartService.item[i].product.price * this.cartService.item[i].quantity;
    }
    this.total = this.subTotal;
  }

  deleteItem(productId: number){
    this.cartService.deleteItem(productId);
    this.item = this.cartService.getItems();
    this.calculateDetails();
  }

  changeQuantity(productId: number, quantity: number){
    this.cartService.changeQuantity(productId, quantity);
    this.item = this.cartService.getItems();
    this.calculateDetails();
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  submitOrder(): void {
    if (!this.handler.isLoggedIn()) {
      alert('Para realizar el pedido debes iniciar sesión o crear una cuenta.');
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.handler.getCurrentUser();
    if (!currentUser) {
      alert('Para realizar el pedido debes iniciar sesión o crear una cuenta.');
      this.router.navigate(['/registration']);
      return;
    }

    const order: Order = {
      id: Date.now(),
      userEmail: currentUser.email,
      userName: currentUser.name,
      date: new Date().toISOString(),
      items: this.item,
      note: this.orderNote,
      total: this.total
    };

    this.handler.saveOrder(order);
    this.whatsappService.sendOrder(this.item, this.orderNote);
    this.cartService.clearCart();
    this.item = [];
    this.subTotal = 0;
    this.total = 0;
    this.orderNote = '';
  }

}
