import { Json, Tables, TablesInsert, TablesUpdate } from '../../server/src/types/database.types';

// Data Transfer Objects (DTOs) reflecting database rows
export type BoxDto = Tables<'boxes'>; // corresponds to public.boxes.Row
export type TagDto = Tables<'tags'>; // corresponds to public.tags.Row
export type FlashcardDto = Tables<'flashcards'>; // corresponds to public.flashcards.Row
export type GenerationLogDto = Tables<'generation_log'>; // corresponds to public.generation_log.Row

// Pagination metadata for list responses
export type PaginationMetaDto = {
  page: number;
  per_page: number;
  total: number;
};

// ===== Boxes =====
// Response for listing boxes with pagination
export interface BoxesListResponseDto {
  items: BoxDto[];
  meta: PaginationMetaDto;
}
// Single box response
export type BoxResponseDto = BoxDto;

// ===== Tags =====
// Response for listing tags
export type TagsListResponseDto = TagDto[];
// Single tag response
export type TagResponseDto = TagDto;

// ===== Box Tags =====
// Response for listing tags assigned to a box
export type BoxTagsListResponseDto = TagDto[];
// Response after adding a tag to a box (returns the Tag)
export type AddTagToBoxResponseDto = TagDto;

// ===== Flashcards =====
// Response for listing flashcards with pagination
export interface FlashcardsListResponseDto {
  items: FlashcardDto[];
  meta: PaginationMetaDto;
}
// Single flashcard response
export type FlashcardResponseDto = FlashcardDto;
// Response for bulk-created flashcards
export type BulkCreateFlashcardsResponseDto = FlashcardDto[];

// ===== AI Generation =====
// DTO representing a single suggested flashcard
export interface FlashcardSuggestionDto {
  id: string;
  front: string;
  back: string;
  generation_info: Json;
}
// Response for generation suggestions
export interface GenerateFlashcardsResponseDto {
  suggestions: FlashcardSuggestionDto[];
}

// ===== Generation Logs =====
// Response for listing generation logs
export type GenerationLogsListResponseDto = GenerationLogDto[];
// Single generation log response
export type GenerationLogResponseDto = GenerationLogDto; 