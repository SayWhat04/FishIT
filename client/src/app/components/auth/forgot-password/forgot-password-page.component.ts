import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { ForgotPasswordFormComponent } from '../forgot-password/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthLayoutComponent,
    ForgotPasswordFormComponent
  ],
  template: `
    <app-auth-layout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link">
      <app-forgot-password-form></app-forgot-password-form>
    </app-auth-layout>
  `
})
export class ForgotPasswordPageComponent {} 