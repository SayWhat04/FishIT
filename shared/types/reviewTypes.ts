import { FlashcardSuggestionDto } from './dto';

/**
 * Extends FlashcardSuggestionDto with a status field for UI purposes
 * Used in the review components to track the review status of suggested flashcards
 */
export interface ReviewFlashcard extends FlashcardSuggestionDto {
  status?: 'accepted' | 'rejected' | 'editing';
} 