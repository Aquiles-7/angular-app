import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Search } from '../../../models/search';
import { ProductService } from '../../../services/product-service';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css',
})
export class SearchComponent {
  searchParameter: Search = {
    text: '',
  };

  constructor(
    private router: Router,
    private productService: ProductService

  ) {}

  products: Product[] = [];

  async searchItem() {
    this.products = await this.productService.searchProducts(this.searchParameter);
    this.router.navigate(['/catalog']);
  }

  
}
