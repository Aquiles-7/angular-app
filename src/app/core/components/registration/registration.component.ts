import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpHandlerService } from '../../../services/http-handler.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private handler: HttpHandlerService
  ) {}

  public ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{3,40}$')]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get mobileNumber() {
    return this.registerForm.get('mobileNumber');
  }

  get password() {
    return this.registerForm.get('password');
  }

  public onSubmit(user: { name: string; email: string; mobileNumber: string; password: string }) {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.handler.register(user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error: unknown) => {
        this.loading = false;
        this.errorMessage = error instanceof Error ? error.message : 'Error al registrar el usuario';
      }
    });
  }
}
