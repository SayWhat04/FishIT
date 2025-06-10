import express, { RequestHandler } from "express";
import { supabase } from "../../db/supabase.client";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(auth as unknown as RequestHandler);

router.get("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const flashcardId = req.params['id'];

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        boxes!inner(user_id)
      `)
      .eq('id', flashcardId)
      .eq('is_deleted', false)
      .eq('boxes.user_id', userId)
      .single();

    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!flashcard) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    const { boxes, ...flashcardData } = flashcard;
    res.json(flashcardData);
    return;
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard' });
    return;
  }
}) as RequestHandler);

router.put("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const flashcardId = req.params['id'];
    const { front, back } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!front || !back) {
      res.status(400).json({ error: 'Front and back are required' });
      return;
    }

    const { data: existingFlashcard, error: checkError } = await supabase
      .from('flashcards')
      .select(`
        id,
        boxes!inner(user_id)
      `)
      .eq('id', flashcardId)
      .eq('is_deleted', false)
      .eq('boxes.user_id', userId)
      .single();

    if (checkError) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!existingFlashcard) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    const { data: flashcard, error: updateError } = await supabase
      .from('flashcards')
      .update({
        front,
        back,
        updated_at: new Date().toISOString()
      })
      .eq('id', flashcardId)
      .select()
      .single();

    if (updateError) {
      res.status(500).json({ error: 'Failed to update flashcard' });
      return;
    }

    res.json(flashcard);
    return;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'Failed to update flashcard' });
    return;
  }
}) as RequestHandler);

router.delete("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const flashcardId = req.params['id'];

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { data: existingFlashcard, error: checkError } = await supabase
      .from('flashcards')
      .select(`
        id,
        boxes!inner(user_id)
      `)
      .eq('id', flashcardId)
      .eq('is_deleted', false)
      .eq('boxes.user_id', userId)
      .single();

    if (checkError) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!existingFlashcard) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    const { error: deleteError } = await supabase
      .from('flashcards')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', flashcardId);

    if (deleteError) {
      res.status(500).json({ error: 'Failed to delete flashcard' });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Failed to delete flashcard' });
    return;
  }
}) as RequestHandler);

export default router; 