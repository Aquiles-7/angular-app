import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpHandlerService } from '../../../services/http-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  hide = true;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private handler: HttpHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public onSubmit(user: { email: string; password: string }) {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.handler.login(user).subscribe({
      next: (token: string) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      }
    });
  }
}
