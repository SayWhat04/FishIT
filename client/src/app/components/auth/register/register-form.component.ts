import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthInputComponent } from '../auth-input.component';
import { AuthButtonComponent } from '../auth-button.component';
import { AuthErrorComponent } from '../auth-error.component';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthInputComponent,
    AuthButtonComponent,
    AuthErrorComponent
  ],
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  passwordHint = 'Password must be at least 8 characters long';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Dodajemy walidator po inicjalizacji, aby uniknąć problemów z cyklem walidacji
    this.registerForm.addValidators(this.passwordMatchValidator());
    this.registerForm.updateValueAndValidity();
  }

  passwordMatchValidator() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');
      
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      
      // Sprawdzamy tylko jeśli oba pola mają wartości
      if (password && confirmPassword && password !== confirmPassword) {
        // Bezpośrednio ustawiamy błąd na polu potwierdzenia hasła
        confirmPasswordControl.setErrors({...confirmPasswordControl.errors, passwordMismatch: true});
        return { passwordMismatch: true };
      }
      
      // Jeśli hasła się zgadzają, a była ustawiona błąd, czyścimy go
      // ale zachowujemy inne potencjalne błędy
      if (confirmPasswordControl.errors) {
        const { passwordMismatch, ...otherErrors } = confirmPasswordControl.errors;
        confirmPasswordControl.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
      }
      
      return null;
    };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return '';
    }

    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['minlength']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    // Pokaż pierwsze znalezione błędy, jeśli nie dopasowano konkretnych przypadków
    return Object.keys(control.errors)[0];
  }

  onSubmit() {
    // Oznacz wszystkie pola jako dotknięte, aby wyświetlić błędy
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsDirty();
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
    
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      
      const { email, password, username } = this.registerForm.value;
      
      this.authService.register(email, password, username)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            // Przekierowanie do strony logowania po pomyślnej rejestracji
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
          }
        });
    }
  }
} 