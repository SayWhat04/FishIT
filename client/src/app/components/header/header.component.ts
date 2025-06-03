import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddBoxDialogComponent } from '../boxes/add-box-dialog.component';
import { AuthService } from '../../services/auth.service';
import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatChipsModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private boxService = inject(BoxService);

  // Check if user is authenticated using the AuthService signal
  protected isAuthenticated = this.authService.isLoggedIn;

  openAddBoxDialog(): void {
    const dialogRef = this.dialog.open(AddBoxDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('Box created successfully!');
        // Box service automatically updates cache when creating box
        // No need to reload the page or clear cache manually
      }
    });
  }

  navigateToGenerate(): void {
    this.router.navigate(['/generate']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showSuccess('Logged out successfully!');
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.showError('Logout failed. Please try again.');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Retry', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }
}
