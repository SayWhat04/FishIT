import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private authToken = signal<string | null>(localStorage.getItem('authToken'));
  
  isAuthenticated(): Observable<boolean> {
    // If we have a token in memory, consider the user authenticated
    if (this.authToken()) {
      return of(true);
    }
    
    // Otherwise, check if there's a session on the server
    return this.http.get<{ authenticated: boolean }>('/api/auth/session').pipe(
      map(response => response.authenticated)
    );
  }
  
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      map(() => true)
    );
  }
  
  register(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>('/api/auth/register', { email, password }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      map(() => true)
    );
  }
  
  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }
  
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('authToken', authResult.token);
    this.authToken.set(authResult.token);
  }
  
  private clearSession(): void {
    localStorage.removeItem('authToken');
    this.authToken.set(null);
  }
} 