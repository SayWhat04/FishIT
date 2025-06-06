import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../../services/box.service';
import { BoxDto } from '@shared/types/dto';

export interface DeleteConfirmDialogData {
  box: BoxDto;
}

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<DeleteConfirmDialogComponent>);
  private boxService = inject(BoxService);
  private snackBar = inject(MatSnackBar);

  box: BoxDto;
  isDeleting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteConfirmDialogData) {
    this.box = data.box;
  }

  onConfirmDelete(): void {
    if (this.isDeleting) return; // Prevent double-click

    this.isDeleting = true;

    this.boxService.deleteBox(this.box.id).subscribe({
      next: () => {
        this.snackBar.open(
          `Box "${this.box.name}" deleted successfully`, 
          'OK', 
          { duration: 3000 }
        );
        this.dialogRef.close(true); // Return true to indicate successful deletion
      },
      error: error => {
        console.error('Error deleting box:', error);
        this.isDeleting = false;
        this.snackBar.open(
          'Failed to delete box. Please try again.', 
          'OK', 
          { duration: 5000 }
        );
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getFlashcardCount(): number {
    return this.box.flashcard_count || 0;
  }

  getFlashcardText(): string {
    const count = this.getFlashcardCount();
    return count === 1 ? 'flashcard' : 'flashcards';
  }
} 