import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private handler: HttpHandlerService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.handler.isLoggedIn()) {
      return true;
    }

    alert('Debes iniciar sesión o crear una cuenta para acceder al perfil.');
    this.router.navigate(['/registration']);
    return false;
  }
}
