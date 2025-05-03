import { Routes } from '@angular/router';
import { GeneratePageComponent } from './components/generate/generate-page.component';
import { ReviewPageComponent } from './components/review/review-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
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
