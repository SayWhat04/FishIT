import { Json, TablesInsert, TablesUpdate } from '../../server/src/types/database.types';

export type CreateBoxCommand = Pick<TablesInsert<'boxes'>, 'name' | 'description'>;

export type UpdateBoxCommand = Partial<Pick<TablesInsert<'boxes'>, 'name' | 'description'>>;

export type CreateTagCommand = Pick<TablesInsert<'tags'>, 'name'>;

export type AddTagToBoxCommand = Pick<TablesInsert<'box_tags'>, 'tag_id'>;

export type CreateFlashcardCommand =
  Pick<TablesInsert<'flashcards'>, 'front' | 'back'> &
  Partial<Pick<TablesInsert<'flashcards'>, 'is_ai_generated'>> & {
    generation_info?: Json;
  };

export type UpdateFlashcardCommand = Partial<Pick<TablesUpdate<'flashcards'>, 'front' | 'back'>>;

export type BulkCreateFlashcardsCommand = CreateFlashcardCommand[];

export interface GenerateFlashcardsCommand {
  text: string;
  count: number;
}
