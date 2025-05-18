import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddBoxDialogComponent } from '../boxes/add-box-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);

  openAddBoxDialog(): void {
    const dialogRef = this.dialog.open(AddBoxDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Box was created successfully, refresh the current view
        window.location.reload();
      }
    });
  }

  navigateToGenerate(): void {
    this.router.navigate(['/generate']);
  }
}
