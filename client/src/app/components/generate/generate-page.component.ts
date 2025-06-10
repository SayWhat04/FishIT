import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateFormComponent } from './generate-form.component';
import { GenerationProgressComponent } from './generation-progress.component';
import { GenerateService } from '../../services/generate.service';
import { GenerateFlashcardsCommand } from '@shared/types/commands';
import { GenerateFlashcardsResponseDto } from '@shared/types/dto';

@Component({
  selector: 'app-generate-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    GenerateFormComponent, 
    GenerationProgressComponent
  ],
  templateUrl: './generate-page.component.html',
  styleUrls: ['./generate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratePageComponent {
  private generateService = inject(GenerateService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  handleGenerate(request: GenerateFlashcardsCommand): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.generateService.generate(request).subscribe({
      next: (response: GenerateFlashcardsResponseDto) => {
        this.isLoading.set(false);
        this.router.navigate(['/review'], {
          state: { suggestions: response.suggestions },
        });
      },
      error: error => {
        console.error('Error generating flashcards:', error);
        this.isLoading.set(false);

        let errorMessage = 'Server error occurred. Please try again.';
        
        if (error.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid form data. Please check your inputs.';
        } else if (error.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Please check your permissions.';
        }

        this.error.set(errorMessage);
        this.snackBar.open(errorMessage, 'OK', {
          duration: 5000,
        });
      },
    });
  }

  onRetry(): void {
    this.error.set(null);
  }
}
