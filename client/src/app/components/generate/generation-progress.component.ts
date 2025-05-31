import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generation-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule, MatIconModule],
  templateUrl: './generation-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerationProgressComponent {
  @Input() isLoading = false;
}
