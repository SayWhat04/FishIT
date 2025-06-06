import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FlashcardDto } from '@shared/types/dto';

@Component({
  selector: 'app-flashcard-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './flashcard-item.component.html',
  styleUrls: ['./flashcard-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardItemComponent {
  @Input({ required: true }) flashcard!: FlashcardDto;
  @Input() showActions = true;
  @Input() expanded = false;

  @Output() edit = new EventEmitter<FlashcardDto>();
  @Output() delete = new EventEmitter<FlashcardDto>();
  @Output() toggleExpanded = new EventEmitter<FlashcardDto>();

  onEdit(): void {
    this.edit.emit(this.flashcard);
  }

  onDelete(): void {
    this.delete.emit(this.flashcard);
  }

  onToggleExpanded(): void {
    this.toggleExpanded.emit(this.flashcard);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
} 