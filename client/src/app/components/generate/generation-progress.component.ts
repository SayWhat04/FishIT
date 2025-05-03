import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-generation-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './generation-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerationProgressComponent {
  @Input() isLoading = false;
} 