import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Catalog } from './pages/catalog/catalog';
import { Cart } from './pages/cart/cart';
import { LoginComponent } from './core/components/login/login.component';
import { RegistrationComponent } from './core/components/registration/registration.component';
import { Profile } from './core/components/profile/profile';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalog', component: Catalog },
  { path: 'cart', component: Cart },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
];
