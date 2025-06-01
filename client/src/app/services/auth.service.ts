import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: {
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
  private authToken = signal<string | null>(localStorage.getItem('authToken'));
  
  // Public signal for UI reactivity
  public isLoggedIn = signal<boolean>(false);

  constructor() {
    this.refreshAuthState();
  }

  // Refresh authentication state based on localStorage
  private refreshAuthState(): void {
    const token = localStorage.getItem('authToken');
    const hasValidToken = !!token && token.trim() !== '';
    this.authToken.set(token);
    this.isLoggedIn.set(hasValidToken);
  }

  // Getter dla tokenu do wykorzystania w interceptorze HTTP
  getToken(): string | null {
    return this.authToken();
  }

  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated(): Observable<boolean> {
    // Jeśli mamy token w pamięci, uznajemy użytkownika za zalogowanego
    if (this.authToken()) {
      return this.http
        .get<{ authenticated: boolean }>('/api/auth/session', {
          headers: this.getAuthHeaders(),
        })
        .pipe(
          map(response => response.authenticated),
          catchError(() => {
            // W przypadku błędu weryfikacji tokena, wylogowujemy użytkownika
            this.clearSession();
            return of(false);
          })
        );
    }

    // W przeciwnym razie nie jesteśmy zalogowani
    return of(false);
  }

  // Logowanie użytkownika
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Rejestracja nowego użytkownika
  register(email: string, password: string, username?: string): Observable<boolean> {
    return this.http.post<AuthResponse>('/api/auth/register', { email, password, username }).pipe(
      tap(response => {
        // Supabase może wymagać potwierdzenia email i nie zwrócić tokenu
        if (response.token) {
          this.setSession(response);
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Wylogowanie użytkownika
  logout(): Observable<void> {
    // Nagłówki z aktualnym tokenem
    const headers = this.getAuthHeaders();

    return this.http.post<void>('/api/auth/logout', {}, { headers }).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        // Nawet w przypadku błędu, czyścimy lokalną sesję
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  // Tworzenie nagłówków z tokenem autoryzacji
  private getAuthHeaders(): HttpHeaders {
    const token = this.authToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Zapisanie sesji po pomyślnym logowaniu
  private setSession(authResult: AuthResponse): void {
    if (authResult.token) {
      localStorage.setItem('authToken', authResult.token);
      this.authToken.set(authResult.token);
      this.isLoggedIn.set(true);
    }
  }

  // Wyczyszczenie sesji po wylogowaniu
  private clearSession(): void {
    localStorage.removeItem('authToken');
    this.authToken.set(null);
    this.isLoggedIn.set(false);
  }
}
