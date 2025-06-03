import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { BoxDto, BoxesListResponseDto } from '@shared/types/dto';
import { CreateBoxCommand, UpdateBoxCommand } from '@shared/types/commands';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private http = inject(HttpClient);

  // Cache the boxes to avoid multiple requests within the same user session
  private boxesCache = signal<BoxDto[]>([]);
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all boxes for the current user
   */
  getBoxes(forceRefresh = false): Observable<BoxDto[]> {
    const now = Date.now();
    const isCacheValid = this.boxesCache().length > 0 && 
                         (now - this.cacheTimestamp) < this.CACHE_DURATION;

    // If we have valid cached boxes and no force refresh, return them
    if (!forceRefresh && isCacheValid) {
      return of(this.boxesCache());
    }

    // Otherwise fetch from API
    return this.http.get<BoxesListResponseDto>('/api/boxes').pipe(
      map(response => response.items),
      tap(boxes => {
        this.boxesCache.set(boxes);
        this.cacheTimestamp = now;
      }),
      catchError(error => {
        console.error('Error fetching boxes:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific box by ID
   */
  getBox(boxId: string): Observable<BoxDto> {
    return this.http.get<BoxDto>(`/api/boxes/${boxId}`).pipe(
      catchError(error => {
        console.error(`Error fetching box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new box
   */
  createBox(command: CreateBoxCommand): Observable<BoxDto> {
    return this.http.post<BoxDto>('/api/boxes', command).pipe(
      tap(newBox => {
        // Update cache with the new box
        this.boxesCache.update(boxes => [...boxes, newBox]);
      }),
      catchError(error => {
        console.error('Error creating box:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing box
   */
  updateBox(boxId: string, command: UpdateBoxCommand): Observable<BoxDto> {
    return this.http.put<BoxDto>(`/api/boxes/${boxId}`, command).pipe(
      tap(updatedBox => {
        // Update the box in cache
        this.boxesCache.update(boxes => boxes.map(box => (box.id === boxId ? updatedBox : box)));
      }),
      catchError(error => {
        console.error(`Error updating box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a box
   */
  deleteBox(boxId: string): Observable<void> {
    return this.http.delete<void>(`/api/boxes/${boxId}`).pipe(
      tap(() => {
        // Remove the box from cache
        this.boxesCache.update(boxes => boxes.filter(box => box.id !== boxId));
      }),
      catchError(error => {
        console.error(`Error deleting box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add flashcards to a box
   */
  addFlashcardsToBox(boxId: string, flashcards: any[]): Observable<any> {
    return this.http.post<any>(`/api/boxes/${boxId}/flashcards/bulk`, flashcards).pipe(
      catchError(error => {
        console.error(`Error adding flashcards to box ${boxId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear the boxes cache to force a fresh fetch on next request
   */
  clearCache(): void {
    this.boxesCache.set([]);
    this.cacheTimestamp = 0;
  }
}
