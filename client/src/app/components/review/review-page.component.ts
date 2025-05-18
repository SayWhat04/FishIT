import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReviewListComponent } from './review-list.component';
import { BoxService } from '../../services/box.service';
import { BoxDto } from '@shared/types/dto';
import { ReviewFlashcard } from '@shared/types/reviewTypes';

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    ReviewListComponent,
  ],
  templateUrl: './review-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPageComponent implements OnInit {
  private router = inject(Router);
  private boxService = inject(BoxService);
  private snackBar = inject(MatSnackBar);

  suggestions = signal<ReviewFlashcard[]>([]);
  boxes = signal<BoxDto[]>([]);
  selectedBoxId = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    // Load boxes
    this.loadBoxes();

    // Get suggestions from router state
    const state = this.router.getCurrentNavigation()?.extras.state as
      | { suggestions: ReviewFlashcard[] }
      | undefined;
    const historyState = history.state as { suggestions: ReviewFlashcard[] } | undefined;

    const suggestions = state?.suggestions || historyState?.suggestions;

    if (!suggestions || suggestions.length === 0) {
      this.snackBar.open('No flashcards to review. Please generate some first.', 'OK', {
        duration: 5000,
      });
      this.router.navigate(['/generate']);
      return;
    }

    this.suggestions.set(suggestions);
  }

  private loadBoxes(): void {
    this.boxService.getBoxes().subscribe({
      next: boxes => {
        this.boxes.set(boxes);
        if (boxes.length > 0) {
          this.selectedBoxId.set(boxes[0].id);
        }
      },
      error: error => {
        console.error('Error loading boxes:', error);
        this.snackBar.open('Failed to load boxes. Please try again.', 'OK', { duration: 5000 });
      },
    });
  }

  onBoxSelected(boxId: string): void {
    this.selectedBoxId.set(boxId);
  }

  saveAcceptedFlashcards(): void {
    if (!this.selectedBoxId()) {
      this.snackBar.open('Please select a box to save the flashcards.', 'OK', { duration: 5000 });
      return;
    }

    const acceptedFlashcards = this.suggestions()
      .filter(suggestion => suggestion.status === 'accepted')
      .map(suggestion => ({
        front: suggestion.front,
        back: suggestion.back,
        is_ai_generated: true,
        generation_info: suggestion.generation_info,
      }));

    if (acceptedFlashcards.length === 0) {
      this.snackBar.open(
        'No flashcards have been accepted. Please review and accept some flashcards.',
        'OK',
        { duration: 5000 }
      );
      return;
    }

    this.isLoading.set(true);
    this.boxService.addFlashcardsToBox(this.selectedBoxId()!, acceptedFlashcards).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open(`${acceptedFlashcards.length} flashcards added to box.`, 'OK', {
          duration: 5000,
        });
        this.router.navigate(['/boxes', this.selectedBoxId()]);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to add flashcards to box. Please try again.', 'OK', {
          duration: 5000,
        });
      },
    });
  }
}
