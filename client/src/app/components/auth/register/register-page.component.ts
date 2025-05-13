import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout.component';
import { RegisterFormComponent } from '../register/register-form.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthLayoutComponent,
    RegisterFormComponent
  ],
  template: `
    <app-auth-layout
      title="Create Account"
      subtitle="Sign up to start creating your flashcards">
      <app-register-form></app-register-form>
    </app-auth-layout>
  `
})
export class RegisterPageComponent {} 