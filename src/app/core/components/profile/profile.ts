import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpHandlerService } from '../../../services/http-handler.service';
import { Order } from '../../../models/order';
import { Registration } from '../../../models/registration';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  currentUser: Registration | null = null;
  orders: Order[] = [];
  submitted = false;
  message: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private handler: HttpHandlerService
  ) {}

  ngOnInit() {
    if (!this.handler.isLoggedIn()) {
      this.router.navigate(['/registration']);
      return;
    }

    this.currentUser = this.handler.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/registration']);
      return;
    }

    this.profileForm = this.formBuilder.group({
      name: [this.currentUser.name, [Validators.required, Validators.pattern('^[a-zA-Z ]{3,40}$')]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      mobileNumber: [this.currentUser.mobileNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: [this.currentUser.password, [Validators.required, Validators.minLength(4)]]
    });

    this.orders = this.handler.getOrdersForCurrentUser();
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get mobileNumber() {
    return this.profileForm.get('mobileNumber');
  }

  get password() {
    return this.profileForm.get('password');
  }

  public onSubmit() {
    this.submitted = true;
    this.message = null;

    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }

    const updatedProfile: Registration = {
      name: this.name?.value,
      email: this.email?.value,
      mobileNumber: this.mobileNumber?.value,
      password: this.password?.value
    };

    this.handler.updateUser(updatedProfile).subscribe({
      next: () => {
        this.message = 'Datos actualizados correctamente.';
        this.currentUser = updatedProfile;
      },
      error: (error: unknown) => {
        this.message = error instanceof Error ? error.message : 'No se pudieron guardar los cambios.';
      }
    });
  }

  public logout() {
    this.handler.logout();
    this.router.navigate(['/login']);
  }
}
