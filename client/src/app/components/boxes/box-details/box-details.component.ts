import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { BoxService } from '../../services/box.service';
import { FlashcardService } from '../../services/flashcard.service';
import { FlashcardItemComponent } from '../flashcards/flashcard-item.component';
import { BoxDto, FlashcardDto } from '@shared/types/dto';

@Component({
  selector: 'app-box-details',
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
    FlashcardItemComponent,
  ],
  templateUrl: './box-details.component.html',
  styleUrls: ['./box-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boxService = inject(BoxService);
  private flashcardService = inject(FlashcardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  // State signals
  box = signal<BoxDto | null>(null);
  flashcards = signal<FlashcardDto[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  isLoadingFlashcards = signal<boolean>(false);
  error = signal<string | null>(null);
  expandedFlashcards = signal<Set<string>>(new Set());

  // Computed filtered flashcards based on search query
  filteredFlashcards = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.flashcards();
    }
    return this.flashcards().filter(flashcard => 
      flashcard.front.toLowerCase().includes(query) ||
      flashcard.back.toLowerCase().includes(query)
    );
  });

  // Computed statistics
  stats = computed(() => {
    const allFlashcards = this.flashcards();
    const aiGenerated = allFlashcards.filter(f => f.is_ai_generated).length;
    const manual = allFlashcards.length - aiGenerated;
    
    return {
      total: allFlashcards.length,
      aiGenerated,
      manual,
    };
  });

  ngOnInit(): void {
    const boxId = this.route.snapshot.paramMap.get('id');
    if (boxId) {
      this.loadBoxAndFlashcards(boxId);
    } else {
      this.router.navigate(['/boxes']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoxAndFlashcards(boxId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load both box and flashcards in parallel
    forkJoin({
      box: this.boxService.getBox(boxId),
      flashcards: this.flashcardService.getFlashcards(boxId, true)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ box, flashcards }) => {
        this.box.set(box);
        this.flashcards.set(flashcards);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading box and flashcards:', error);
        this.error.set('Failed to load box details. Please try again.');
        this.isLoading.set(false);
        this.snackBar.open('Failed to load box details. Please try again.', 'OK', { 
          duration: 5000 
        });
        // Navigate back to boxes list on error
        this.router.navigate(['/boxes']);
      },
    });
  }

  private loadFlashcards(): void {
    const boxId = this.box()?.id;
    if (!boxId) return;

    this.isLoadingFlashcards.set(true);
    this.flashcardService.getFlashcards(boxId, true).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: flashcards => {
        this.flashcards.set(flashcards);
        this.isLoadingFlashcards.set(false);
      },
      error: error => {
        console.error('Error loading flashcards:', error);
        this.isLoadingFlashcards.set(false);
        this.snackBar.open('Failed to load flashcards. Please try again.', 'OK', { 
          duration: 5000 
        });
      },
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onSearchChange(target?.value || '');
  }

  onBackToBoxes(): void {
    this.router.navigate(['/boxes']);
  }

  onEditBox(): void {
    const box = this.box();
    if (!box) return;

    // TODO: Implement EditBoxDialogComponent integration
    this.snackBar.open('Edit box functionality coming soon!', 'OK', { duration: 3000 });
  }

  onDeleteBox(): void {
    const box = this.box();
    if (!box) return;

    // TODO: Implement DeleteConfirmDialogComponent integration
    this.snackBar.open('Delete box functionality coming soon!', 'OK', { duration: 3000 });
  }

  onAddFlashcard(): void {
    // TODO: Implement AddFlashcardDialogComponent
    this.snackBar.open('Add flashcard functionality coming soon!', 'OK', { duration: 3000 });
  }

  onStartStudy(): void {
    const box = this.box();
    if (!box) return;

    // TODO: Implement study session routing
    this.router.navigate(['/boxes', box.id, 'study']);
  }

  onEditFlashcard(flashcard: FlashcardDto): void {
    // TODO: Implement EditFlashcardDialogComponent
    console.log('Edit flashcard:', flashcard);
    this.snackBar.open('Edit flashcard functionality coming soon!', 'OK', { duration: 3000 });
  }

  onDeleteFlashcard(flashcard: FlashcardDto): void {
    // TODO: Implement DeleteFlashcardConfirmDialogComponent
    console.log('Delete flashcard:', flashcard);
    this.snackBar.open('Delete flashcard functionality coming soon!', 'OK', { duration: 3000 });
  }

  onToggleFlashcardExpanded(flashcard: FlashcardDto): void {
    const currentExpanded = this.expandedFlashcards();
    const newExpanded = new Set(currentExpanded);
    
    if (newExpanded.has(flashcard.id)) {
      newExpanded.delete(flashcard.id);
    } else {
      newExpanded.add(flashcard.id);
    }
    
    this.expandedFlashcards.set(newExpanded);
  }

  isFlashcardExpanded(flashcard: FlashcardDto): boolean {
    return this.expandedFlashcards().has(flashcard.id);
  }

  onRefresh(): void {
    const boxId = this.box()?.id;
    if (boxId) {
      this.loadBoxAndFlashcards(boxId);
    }
  }

  // Helper methods for template
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getFlashcardCount(): number {
    return this.flashcards().length;
  }

  getAiGeneratedCount(): number {
    return this.stats().aiGenerated;
  }

  getManualCount(): number {
    return this.stats().manual;
  }
} 