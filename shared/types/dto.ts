import { Json, Tables, TablesInsert, TablesUpdate } from '../../server/src/types/database.types';

export type BoxDto = Tables<'boxes'>; // corresponds to public.boxes.Row
export type TagDto = Tables<'tags'>; // corresponds to public.tags.Row
export type FlashcardDto = Tables<'flashcards'>; // corresponds to public.flashcards.Row
export type GenerationLogDto = Tables<'generation_log'>; // corresponds to public.generation_log.Row

export type PaginationMetaDto = {
  page: number;
  per_page: number;
  total: number;
};

export interface BoxesListResponseDto {
  items: BoxDto[];
  meta: PaginationMetaDto;
}
export type BoxResponseDto = BoxDto;
export type TagsListResponseDto = TagDto[];
export type TagResponseDto = TagDto;
export type BoxTagsListResponseDto = TagDto[];
export type AddTagToBoxResponseDto = TagDto;

export interface FlashcardsListResponseDto {
  items: FlashcardDto[];
  meta: PaginationMetaDto;
}
export type FlashcardResponseDto = FlashcardDto;
export type BulkCreateFlashcardsResponseDto = FlashcardDto[];

export interface FlashcardSuggestionDto {
  id: string;
  front: string;
  back: string;
  generation_info: Json;
}
export interface GenerateFlashcardsResponseDto {
  suggestions: FlashcardSuggestionDto[];
}

export type GenerationLogsListResponseDto = GenerationLogDto[];
export type GenerationLogResponseDto = GenerationLogDto; 