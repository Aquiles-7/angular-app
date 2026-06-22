import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  private readonly WHATSAPP_NUMBER = '542612723486';

  sendOrder(cartItems: CartItem[], note: string = ''): void {
    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    let subtotal = 0;
    const lines: string[] = [];

    cartItems.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      lines.push(`${item.quantity} x ${item.product.title} — $${item.product.price} c/u — $${itemTotal}`);
    });

    lines.push(`\nSubtotal: $${subtotal}`);
    lines.push(`Total: $${subtotal}`);

    if (note.trim()) {
      lines.push(`\nNota: ${note}`);
    }

    const message = encodeURIComponent(lines.join('\n'));
    
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`
      : `https://web.whatsapp.com/send?phone=${this.WHATSAPP_NUMBER}&text=${message}`;

    window.open(url, '_blank');
  }
}