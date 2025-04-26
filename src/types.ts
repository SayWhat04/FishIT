import { Json, Tables, TablesInsert, TablesUpdate } from './db/database.types';

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
// Command model for creating a box
export type CreateBoxCommand = Pick<TablesInsert<'boxes'>, 'name' | 'description'>;
// Command model for updating a box (partial)
export type UpdateBoxCommand = Partial<Pick<TablesInsert<'boxes'>, 'name' | 'description'>>;

// ===== Tags =====
// Response for listing tags
export type TagsListResponseDto = TagDto[];
// Single tag response
export type TagResponseDto = TagDto;
// Command model for creating a tag
export type CreateTagCommand = Pick<TablesInsert<'tags'>, 'name'>;

// ===== Box Tags =====
// Response for listing tags assigned to a box
export type BoxTagsListResponseDto = TagDto[];
// Command model for adding a tag to a box
export type AddTagToBoxCommand = Pick<TablesInsert<'box_tags'>, 'tag_id'>;
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
// Command model for creating a flashcard (manual or AI)
export type CreateFlashcardCommand =
  Pick<TablesInsert<'flashcards'>, 'front' | 'back'> &
  Partial<Pick<TablesInsert<'flashcards'>, 'is_ai_generated'>> & {
  // optional generation metadata when AI-generated
  generation_info?: Json;
};
// Command model for updating a flashcard
export type UpdateFlashcardCommand = Partial<Pick<TablesUpdate<'flashcards'>, 'front' | 'back'>>;
// Bulk creation command (array of individual create commands)
export type BulkCreateFlashcardsCommand = CreateFlashcardCommand[];
// Response for bulk-created flashcards
export type BulkCreateFlashcardsResponseDto = FlashcardDto[];

// ===== AI Generation =====
// Command model for requesting flashcard generation
export interface GenerateFlashcardsCommand {
  text: string;
  count: number;
}
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