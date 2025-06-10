import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { FlashcardDto, FlashcardsListResponseDto } from '@shared/types/dto';
import { CreateFlashcardCommand, UpdateFlashcardCommand } from '@shared/types/commands';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private http = inject(HttpClient);
  
  private flashcardsCache = new Map<string, FlashcardDto[]>();
  private flashcardsSubject = new BehaviorSubject<Map<string, FlashcardDto[]>>(new Map());
  
  public flashcards$ = this.flashcardsSubject.asObservable();

  /**
   * Get all flashcards for a specific box
   */
  getFlashcards(boxId: string, forceRefresh = false): Observable<FlashcardDto[]> {
    if (!forceRefresh && this.flashcardsCache.has(boxId)) {
      return new Observable(observer => {
        observer.next(this.flashcardsCache.get(boxId)!);
        observer.complete();
      });
    }

    return this.http.get<FlashcardsListResponseDto>(`/api/boxes/${boxId}/flashcards`).pipe(
      map(response => response.items),
      tap(flashcards => {
        this.flashcardsCache.set(boxId, flashcards);
        this.flashcardsSubject.next(new Map(this.flashcardsCache));
      }),
      catchError(error => {
        console.error(`Error loading flashcards for box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific flashcard by ID
   */
  getFlashcard(flashcardId: string): Observable<FlashcardDto> {
    return this.http.get<FlashcardDto>(`/api/flashcards/${flashcardId}`).pipe(
      catchError(error => {
        console.error(`Error loading flashcard ${flashcardId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new flashcard
   */
  createFlashcard(boxId: string, command: CreateFlashcardCommand): Observable<FlashcardDto> {
    return this.http.post<FlashcardDto>(`/api/boxes/${boxId}/flashcards`, command).pipe(
      tap(flashcard => {
        const existingFlashcards = this.flashcardsCache.get(boxId) || [];
        const updatedFlashcards = [flashcard, ...existingFlashcards];
        this.flashcardsCache.set(boxId, updatedFlashcards);
        this.flashcardsSubject.next(new Map(this.flashcardsCache));
      }),
      catchError(error => {
        console.error(`Error creating flashcard in box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing flashcard
   */
  updateFlashcard(flashcardId: string, command: UpdateFlashcardCommand): Observable<FlashcardDto> {
    return this.http.put<FlashcardDto>(`/api/flashcards/${flashcardId}`, command).pipe(
      tap(updatedFlashcard => {
        for (const [boxId, flashcards] of this.flashcardsCache.entries()) {
          const index = flashcards.findIndex(f => f.id === flashcardId);
          if (index >= 0) {
            flashcards[index] = updatedFlashcard;
            this.flashcardsCache.set(boxId, [...flashcards]);
            this.flashcardsSubject.next(new Map(this.flashcardsCache));
            break;
          }
        }
      }),
      catchError(error => {
        console.error(`Error updating flashcard ${flashcardId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a flashcard
   */
  deleteFlashcard(flashcardId: string): Observable<void> {
    return this.http.delete<void>(`/api/flashcards/${flashcardId}`).pipe(
      tap(() => {
        for (const [boxId, flashcards] of this.flashcardsCache.entries()) {
          const index = flashcards.findIndex(f => f.id === flashcardId);
          if (index >= 0) {
            flashcards.splice(index, 1);
            this.flashcardsCache.set(boxId, [...flashcards]);
            this.flashcardsSubject.next(new Map(this.flashcardsCache));
            break;
          }
        }
      }),
      catchError(error => {
        console.error(`Error deleting flashcard ${flashcardId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Bulk create flashcards for a box (already exists in BoxService, but for consistency)
   */
  bulkCreateFlashcards(boxId: string, flashcards: CreateFlashcardCommand[]): Observable<FlashcardDto[]> {
    return this.http.post<FlashcardDto[]>(`/api/boxes/${boxId}/flashcards/bulk`, flashcards).pipe(
      tap(createdFlashcards => {
        const existingFlashcards = this.flashcardsCache.get(boxId) || [];
        const updatedFlashcards = [...createdFlashcards, ...existingFlashcards];
        this.flashcardsCache.set(boxId, updatedFlashcards);
        this.flashcardsSubject.next(new Map(this.flashcardsCache));
      }),
      catchError(error => {
        console.error(`Error bulk creating flashcards in box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear cache for a specific box
   */
  clearBoxCache(boxId: string): void {
    this.flashcardsCache.delete(boxId);
    this.flashcardsSubject.next(new Map(this.flashcardsCache));
  }

  /**
   * Clear all flashcard cache
   */
  clearAllCache(): void {
    this.flashcardsCache.clear();
    this.flashcardsSubject.next(new Map());
  }

  /**
   * Get flashcards count for a box from cache
   */
  getFlashcardCount(boxId: string): number {
    const flashcards = this.flashcardsCache.get(boxId);
    return flashcards ? flashcards.length : 0;
  }
} 