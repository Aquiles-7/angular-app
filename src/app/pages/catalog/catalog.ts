import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CatalogComponent } from '../../core/components/catalog-component/catalog-component';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-catalog',
  imports: [ CatalogComponent ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.markForCheck();

        if (data.length === 0) {
          this.productService.getAll();
        }
      },
      error: (err) => {
        console.error('✗ Error al cargar productos:', err);
      }
    });
  }
}
