import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { ResetPasswordFormComponent } from '../reset-password/reset-password-form.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthLayoutComponent,
    ResetPasswordFormComponent
  ],
  template: `
    <app-auth-layout
      title="Set New Password"
      subtitle="Create a new password for your account">
      <app-reset-password-form></app-reset-password-form>
    </app-auth-layout>
  `
})
export class ResetPasswordPageComponent {} 