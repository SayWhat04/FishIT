import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GenerateFlashcardsResponseDto } from '@shared/types/dto';
import { GenerateFlashcardsCommand } from '@shared/types/commands';

@Injectable({
  providedIn: 'root',
})
export class GenerateService {
  private http = inject(HttpClient);

  /**
   * Sends a request to generate flashcards from the provided text
   * @param request The command containing text and count parameters
   * @returns An observable with the generated flashcard suggestions
   */
  generate(request: GenerateFlashcardsCommand): Observable<GenerateFlashcardsResponseDto> {
    return this.http.post<GenerateFlashcardsResponseDto>('/api/ai/flashcards', request).pipe(
      catchError(error => {
        console.error('Error generating flashcards:', error);
        return throwError(() => error);
      })
    );
  }
}
