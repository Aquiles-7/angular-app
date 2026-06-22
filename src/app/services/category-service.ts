import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private productsUrl = 'https://api.escuelajs.co/api/v1/products?limit=10';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map((products: Product[]) => {
        // Agrupar productos por categoría
        const categoryMap = new Map<string, Product[]>();
        
        products.forEach(product => {
          const categoryName = product.category.name;
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, []);
          }
          categoryMap.get(categoryName)!.push(product);
        });

        // Convertir a array de Category
        const categories: Category[] = Array.from(
          categoryMap,
          ([name, products]) => ({
            name: name,
            products: products
          })
        );

        return categories.sort((a, b) => a.name.localeCompare(b.name));
      })
    );
  }
}
