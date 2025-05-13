import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthInputComponent } from '../auth-input.component';
import { AuthButtonComponent } from '../auth-button.component';
import { AuthErrorComponent } from '../auth-error.component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthInputComponent,
    AuthButtonComponent,
    AuthErrorComponent
  ],
  templateUrl: './forgot-password-form.component.html'
})
export class ForgotPasswordFormComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.forgotPasswordForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      // TODO: Implement forgot password logic
      console.log(this.forgotPasswordForm.value);
    }
  }
} 