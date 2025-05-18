import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateFormComponent } from './generate-form.component';
import { GenerationProgressComponent } from './generation-progress.component';
import { GenerateService } from '../../services/generate.service';
import { GenerateFlashcardsCommand } from '@shared/types/commands';
import { GenerateFlashcardsResponseDto } from '@shared/types/dto';

@Component({
  selector: 'app-generate-page',
  standalone: true,
  imports: [CommonModule, GenerateFormComponent, GenerationProgressComponent],
  templateUrl: './generate-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratePageComponent {
  private generateService = inject(GenerateService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal<boolean>(false);

  handleGenerate(request: GenerateFlashcardsCommand): void {
    this.isLoading.set(true);

    this.generateService.generate(request).subscribe({
      next: (response: GenerateFlashcardsResponseDto) => {
        this.isLoading.set(false);
        this.router.navigate(['/review'], {
          state: { suggestions: response.suggestions },
        });
      },
      error: error => {
        this.isLoading.set(false);

        if (error.status === 429) {
          this.snackBar.open('Too many requests. Please try again later.', 'OK', {
            duration: 5000,
          });
        } else if (error.status === 400) {
          this.snackBar.open('Invalid form data. Please check your inputs.', 'OK', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Server error occurred. Please try again.', 'OK', { duration: 5000 });
        }
      },
    });
  }
}
