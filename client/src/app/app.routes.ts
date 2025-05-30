import { Routes } from '@angular/router';
import { GeneratePageComponent } from './components/generate/generate-page.component';
import { ReviewPageComponent } from './components/review/review-page.component';
import { LoginPageComponent } from './components/auth/login/login-page.component';
import { RegisterPageComponent } from './components/auth/register/register-page.component';
import { ForgotPasswordPageComponent } from './components/auth/forgot-password/forgot-password-page.component';
import { ResetPasswordPageComponent } from './components/auth/reset-password/reset-password-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent
  },
  {
    path: 'generate',
    component: GeneratePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'review',
    component: ReviewPageComponent,
    canActivate: [authGuard]
  }
];
