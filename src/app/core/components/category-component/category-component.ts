import { ChangeDetectorRef, Component } from '@angular/core';
import { CategoryService } from '../../../services/category-service';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart-service';
import { CatalogComponent } from '../catalog-component/catalog-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-component',
  standalone: true,
  imports: [CommonModule, CatalogComponent],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent {

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  products: Product[] = [];
  
  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef  
  ) {}

  selectCategory(category: Category) {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category.name);
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(
      categories => {
        this.categories = categories;
        this.cdr.markForCheck();
        console.log('Categorías:', categories);
      }
    );
  }

  addToCart(product: Product){
      if (!this.products) return;
      this.cartService.addItem(product);
      console.log(`✓ Producto agregado al carrito:`, product);
    }
    
}
