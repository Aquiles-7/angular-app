import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-catalog-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-component.html',
  styleUrl: './catalog-component.css',
})
export class CatalogComponent{
  @Input() product!: Product;

  products: Product[] = [];
  private defaultImage = 'https://via.placeholder.com/640?text=Sin+imagen';

  constructor(
    private cartService: CartService,
  ) { }

  addToCart(product: Product){
    if (!this.product) return;
    this.cartService.addItem(product);
    console.log(`✓ Producto agregado al carrito:`, product);
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

}
