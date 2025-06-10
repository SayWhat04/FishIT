import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BoxService } from './box.service';

interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
  message?: string;
}

interface RegistrationResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private boxService = inject(BoxService);
  private authToken = signal<string | null>(localStorage.getItem('authToken'));
  
  public isLoggedIn = signal<boolean>(false);

  constructor() {
    this.refreshAuthState();
  }

  private refreshAuthState(): void {
    const token = localStorage.getItem('authToken');
    const hasValidToken = !!token && token.trim() !== '';
    this.authToken.set(token);
    this.isLoggedIn.set(hasValidToken);
  }

  getToken(): string | null {
    return this.authToken();
  }

  isAuthenticated(): Observable<boolean> {
    if (this.authToken()) {
      return this.http
        .get<{ authenticated: boolean }>('/api/auth/session', {
          headers: this.getAuthHeaders(),
        })
        .pipe(
          map(response => response.authenticated),
          catchError(() => {
            this.clearSession();
            return of(false);
          })
        );
    }

    return of(false);
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.boxService.clearCache();
          this.setSession(response);
        } else {
          throw new Error('No authentication token received');
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(email: string, password: string, username?: string): Observable<boolean> {
    return this.http.post<RegistrationResponse>('/api/auth/register', { email, password, username }).pipe(
      tap(response => {
        console.log('Registration successful:', response.message);
      }),
      map(() => true),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http.post<void>('/api/auth/logout', {}, { headers }).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private setSession(authResult: AuthResponse): void {
    if (authResult.token && authResult.user) {
      localStorage.setItem('authToken', authResult.token);
      this.authToken.set(authResult.token);
      this.isLoggedIn.set(true);
    }
  }

  private clearSession(): void {
    localStorage.removeItem('authToken');
    this.authToken.set(null);
    this.isLoggedIn.set(false);
    this.boxService.clearCache();
  }
}
