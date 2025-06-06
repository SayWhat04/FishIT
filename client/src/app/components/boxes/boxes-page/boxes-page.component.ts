import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from '../../../services/box.service';
import { AddBoxDialogComponent } from '../add-box-dialog/add-box-dialog.component';
import { EditBoxDialogComponent } from '../edit-box-dialog/edit-box-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { BoxDto } from '@shared/types/dto';

@Component({
  selector: 'app-boxes-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './boxes-page.component.html',
  styleUrls: ['./boxes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesPageComponent implements OnInit {
  private router = inject(Router);
  private boxService = inject(BoxService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // State signals
  boxes = signal<BoxDto[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed filtered boxes based on search query
  filteredBoxes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.boxes();
    }
    return this.boxes().filter(box => 
      box.name.toLowerCase().includes(query) ||
      (box.description && box.description.toLowerCase().includes(query))
    );
  });

  ngOnInit(): void {
    this.loadBoxes();
  }

  private loadBoxes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.boxService.getBoxes(true).subscribe({
      next: boxes => {
        this.boxes.set(boxes);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading boxes:', error);
        this.error.set('Failed to load boxes. Please try again.');
        this.isLoading.set(false);
        this.snackBar.open('Failed to load boxes. Please try again.', 'OK', { 
          duration: 5000 
        });
      },
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onCreateBox(): void {
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
        this.snackBar.open('Box created successfully!', 'OK', { duration: 3000 });
        // Box service automatically updates cache when creating box
        this.loadBoxes(); // Refresh the list to ensure consistency
      }
    });
  }

  onViewBox(boxId: string): void {
    this.router.navigate(['/boxes', boxId]);
  }

  onStartStudy(boxId: string): void {
    // TODO: Implement study session routing when component is ready
    this.router.navigate(['/boxes', boxId, 'study']);
  }

  onEditBox(box: BoxDto): void {
    const dialogRef = this.dialog.open(EditBoxDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { box }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Box updated successfully!', 'OK', { duration: 3000 });
        // Box service automatically updates cache when updating box
        this.loadBoxes(); // Refresh the list to ensure consistency
      }
    });
  }

  onDeleteBox(box: BoxDto): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { box }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Box was successfully deleted, refresh the list
        this.loadBoxes();
      }
    });
  }

  onRefresh(): void {
    this.loadBoxes();
  }

  // Helper methods for template
  getFlashcardCount(box: BoxDto): number {
    return box.flashcard_count || 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
} 