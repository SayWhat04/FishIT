import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { LoginFormComponent } from '../login/login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthLayoutComponent,
    LoginFormComponent
  ],
  template: `
    <app-auth-layout
      title="Welcome Back"
      subtitle="Sign in to your account to continue">
      <app-login-form></app-login-form>
    </app-auth-layout>
  `
})
export class LoginPageComponent {} 