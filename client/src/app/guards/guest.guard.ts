import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Używamy lokalnego sygnału isLoggedIn zamiast HTTP requesta
  const isAuthenticated = authService.isLoggedIn();
  
  if (isAuthenticated) {
    // Jeśli użytkownik jest zalogowany, przekieruj do boxes
    router.navigate(['/boxes']);
    return false; // Blokuj dostęp do guest routes
  }
  
  return true; // Pozwól na dostęp niezalogowanym
}; 