import { Routes } from '@angular/router';
import { GeneratePageComponent } from './components/generate/generate-page.component';
import { ReviewPageComponent } from './components/review/review-page.component';
import { LoginPageComponent } from './components/auth/login/login-page.component';
import { RegisterPageComponent } from './components/auth/register/register-page.component';
import { ForgotPasswordPageComponent } from './components/auth/forgot-password/forgot-password-page.component';
import { ResetPasswordPageComponent } from './components/auth/reset-password/reset-password-page.component';
import { BoxesPageComponent } from './components/boxes/boxes-page/boxes-page.component';
import { BoxDetailsComponent } from './components/boxes/box-details/box-details.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boxes',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'boxes',
    component: BoxesPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'boxes/:id',
    component: BoxDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'boxes/:id/study',
    redirectTo: 'boxes/:id', // TODO: Replace with StudySessionComponent when ready
    pathMatch: 'full',
  },
  {
    path: 'generate',
    component: GeneratePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'review',
    component: ReviewPageComponent,
    canActivate: [authGuard],
  },
];
