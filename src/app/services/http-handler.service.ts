import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../models/login';
import { Registration } from '../models/registration';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {
  private usersKey = 'users_db';
  private currentUserKey = 'current_user';
  private ordersKey = 'orders_db';
  private usersAsset = '/assets/users.json';

  constructor(private http: HttpClient) {}

  private loadUsers(): Observable<Registration[]> {
    const stored = localStorage.getItem(this.usersKey);
    if (stored) {
      try {
        return of(JSON.parse(stored) as Registration[]);
      } catch {
        localStorage.removeItem(this.usersKey);
      }
    }

    return this.http.get<Registration[]>(this.usersAsset).pipe(
      tap((users) => localStorage.setItem(this.usersKey, JSON.stringify(users || []))),
      catchError(() => of([]))
    );
  }

  private saveUsers(users: Registration[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private setCurrentUser(user: Registration) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem(this.currentUserKey);
  }

  public getCurrentUser(): Registration | null {
    const current = localStorage.getItem(this.currentUserKey);
    return current ? (JSON.parse(current) as Registration) : null;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.currentUserKey);
  }

  public login(config: Login): Observable<string> {
    return this.loadUsers().pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email.toLowerCase() === config.email.toLowerCase() && u.password === config.password
        );
        if (!user) {
          throw new Error('Email o contraseña incorrectos');
        }
        this.setCurrentUser(user);
        return btoa(`${config.email}:${config.password}`);
      })
    );
  }

  public register(config: Registration): Observable<Registration> {
    return this.loadUsers().pipe(
      map((users) => {
        const exists = users.some((u) => u.email.toLowerCase() === config.email.toLowerCase());
        if (exists) {
          throw new Error('Ya existe un usuario con este email');
        }
        const nextUsers = [...users, config];
        this.saveUsers(nextUsers);
        return config;
      })
    );
  }

  public updateUser(updated: Registration): Observable<Registration> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    return this.loadUsers().pipe(
      map((users) => {
        const exists = users.some(
          (u) => u.email.toLowerCase() === updated.email.toLowerCase() && u.email.toLowerCase() !== currentUser.email.toLowerCase()
        );
        if (exists) {
          throw new Error('El email ya está en uso por otro usuario');
        }

        const userIndex = users.findIndex(
          (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
        );
        if (userIndex === -1) {
          throw new Error('Usuario actual no encontrado');
        }

        users[userIndex] = updated;
        this.saveUsers(users);
        this.setCurrentUser(updated);
        this.updateOrdersEmail(currentUser.email, updated.email);
        return updated;
      })
    );
  }

  public getOrders(): Order[] {
    const stored = localStorage.getItem(this.ordersKey);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored) as Order[];
    } catch {
      localStorage.removeItem(this.ordersKey);
      return [];
    }
  }

  public getOrdersForCurrentUser(): Order[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.getOrders().filter((order) => order.userEmail.toLowerCase() === currentUser.email.toLowerCase());
  }

  public saveOrder(order: Order): void {
    const orders = this.getOrders();
    const nextOrders = [...orders, order];
    localStorage.setItem(this.ordersKey, JSON.stringify(nextOrders));
  }

  private updateOrdersEmail(oldEmail: string, newEmail: string): void {
    const orders = this.getOrders();
    const nextOrders = orders.map((order) => {
      if (order.userEmail.toLowerCase() === oldEmail.toLowerCase()) {
        return { ...order, userEmail: newEmail };
      }
      return order;
    });
    localStorage.setItem(this.ordersKey, JSON.stringify(nextOrders));
  }
}
