import { Component } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CartComponent } from "../../core/components/cart-component/cart-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CartComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
 


}
