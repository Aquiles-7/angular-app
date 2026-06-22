import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { Search } from '../models/search';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'https://api.escuelajs.co/api/v1/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private cachedProducts: Product[] = [];
  private defaultImage = 'https://via.placeholder.com/640?text=Sin+imagen';
  private readonly PRODUCTS_LIMIT = 10;

  constructor(private http: HttpClient) {}

  private async fetchRawProducts(): Promise<Product[]> {
    if (this.cachedProducts.length > 0) {
      return this.cachedProducts;
    }
    const products = await firstValueFrom(
      this.http.get<Product[]>(`${this.productsUrl}?limit=${this.PRODUCTS_LIMIT}`).pipe(
        map(data => data
          .map(p => this.normalizeProduct(p))
          .filter(p => this.hasValidImages(p))
        )
      )
    );
    this.cachedProducts = products;
    return products;
  }

  private hasValidImages(product: Product): boolean {
    return product.images && product.images.length > 0 && product.images[0] !== this.defaultImage;
  }

  private normalizeProduct(product: Product): Product {
    return {
      ...product,
      images: product.images && product.images.length > 0 ? product.images : [this.defaultImage]
    };
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return this.defaultImage;
  }

  async getAll(): Promise<Product[]> {
    const products = await this.fetchRawProducts();
    this.productsSubject.next(products);
    return products;
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductByCategory(categoryName: string): Observable<Product[]> {
    return new Observable(observer => {
      this.fetchRawProducts().then(products => {
        const filtered = products.filter(p =>
          p.category.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase()
        );
        observer.next(filtered);
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const products = await this.fetchRawProducts();
    return products.find(product => product.id === id);
  }

  async searchProducts(parameter: Search) {
    const products = await this.fetchRawProducts();
    const filteredProducts = products.filter(product => {
      if (!parameter.text) return true;
      const matchesTitle = product.title.toLocaleLowerCase().includes(parameter.text.toLocaleLowerCase());
      const matchesDesc = product.description.toLocaleLowerCase().includes(parameter.text.toLocaleLowerCase());
      const matchesCategory = product.category.name.toLocaleLowerCase().includes(parameter.text.toLocaleLowerCase());
      
      return matchesTitle || matchesDesc || matchesCategory;
    });
    this.productsSubject.next(filteredProducts);
    return filteredProducts;
  }

  clearCache(): void {
    this.cachedProducts = [];
  }
}