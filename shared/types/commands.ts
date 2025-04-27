import { Json, TablesInsert, TablesUpdate } from '../../server/src/types/database.types';

// Command model for creating a box
export type CreateBoxCommand = Pick<TablesInsert<'boxes'>, 'name' | 'description'>;
// Command model for updating a box (partial)
export type UpdateBoxCommand = Partial<Pick<TablesInsert<'boxes'>, 'name' | 'description'>>;

// Command model for creating a tag
export type CreateTagCommand = Pick<TablesInsert<'tags'>, 'name'>;

// Command model for adding a tag to a box
export type AddTagToBoxCommand = Pick<TablesInsert<'box_tags'>, 'tag_id'>;

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

// Command model for requesting flashcard generation
export interface GenerateFlashcardsCommand {
  text: string;
  count: number;
}
