import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewItemComponent } from './review-item.component';
import { FlashcardSuggestionDto } from '@shared/types/dto';
import { ReviewFlashcard } from '@shared/types/reviewTypes';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    ReviewItemComponent,
  ],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  @Input() set suggestions(value: ReviewFlashcard[]) {
    // Map the suggestions to add the status field if not present
    this._suggestions = value.map(suggestion => ({
      ...suggestion,
      status: suggestion.status || undefined, // Keep undefined for pending state
    }));
  }

  @Output() suggestionsChange = new EventEmitter<FlashcardSuggestionDto[]>();

  _suggestions: ReviewFlashcard[] = [];

  get acceptedCount(): number {
    return this._suggestions.filter(s => s.status === 'accepted').length;
  }

  get rejectedCount(): number {
    return this._suggestions.filter(s => s.status === 'rejected').length;
  }

  get editingCount(): number {
    return this._suggestions.filter(s => s.status === 'editing').length;
  }

  get pendingCount(): number {
    return this._suggestions.filter(s => !s.status || s.status === undefined).length;
  }

  onStatusChange(suggestion: ReviewFlashcard, status: 'accepted' | 'rejected' | 'editing'): void {
    this._suggestions = this._suggestions.map(s => 
      s.id === suggestion.id 
        ? { ...s, status } 
        : s
    );
    this.suggestionsChange.emit(this._suggestions);
  }

  onFlashcardEdit(originalSuggestion: ReviewFlashcard, updatedSuggestion: ReviewFlashcard): void {
    const index = this._suggestions.findIndex(s => s.id === originalSuggestion.id);
    if (index !== -1) {
      this._suggestions[index] = {
        ...updatedSuggestion,
        status: 'accepted',
      };
      this.suggestionsChange.emit(this._suggestions);
    }
  }

  acceptAll(): void {
    this._suggestions = this._suggestions.map(suggestion => ({
      ...suggestion,
      status: 'accepted',
    }));
    this.suggestionsChange.emit(this._suggestions);
  }

  rejectAll(): void {
    this._suggestions = this._suggestions.map(suggestion => ({
      ...suggestion,
      status: 'rejected',
    }));
    this.suggestionsChange.emit(this._suggestions);
  }
}
