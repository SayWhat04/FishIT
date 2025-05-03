import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewFlashcard } from '@shared/types/reviewTypes';


@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './review-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewItemComponent {
  @Input() suggestion!: ReviewFlashcard;
  @Output() statusChange = new EventEmitter<'accepted' | 'rejected' | 'editing'>();
  @Output() edit = new EventEmitter<ReviewFlashcard>();
  
  editedSuggestion: ReviewFlashcard | null = null;
  
  startEditing(): void {
    this.editedSuggestion = { ...this.suggestion };
    this.statusChange.emit('editing');
  }
  
  cancelEditing(): void {
    this.editedSuggestion = null;
    this.statusChange.emit('accepted');
  }
  
  saveEditing(): void {
    if (this.editedSuggestion) {
      this.edit.emit(this.editedSuggestion);
      this.editedSuggestion = null;
    }
  }
  
  accept(): void {
    this.statusChange.emit('accepted');
  }
  
  reject(): void {
    this.statusChange.emit('rejected');
  }
  
  get isEditing(): boolean {
    return this.suggestion.status === 'editing';
  }
  
  get isAccepted(): boolean {
    return this.suggestion.status === 'accepted';
  }
  
  get isRejected(): boolean {
    return this.suggestion.status === 'rejected';
  }
} 