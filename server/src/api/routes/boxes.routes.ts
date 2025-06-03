import express, { RequestHandler } from "express";
import { supabase } from "../../db/supabase.client";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(auth as unknown as RequestHandler);

// Get all boxes for the current user
router.get("/", (async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const { data: boxes, error } = await supabase
      .from('boxes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      items: boxes,
      meta: {
        total: boxes.length,
        page: 1,
        pageSize: boxes.length
      }
    });
  } catch (error) {
    console.error('Error fetching boxes:', error);
    res.status(500).json({ error: 'Failed to fetch boxes' });
  }
}) as RequestHandler);

// Get a specific box by ID
router.get("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const boxId = req.params['id'];

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { data: box, error } = await supabase
      .from('boxes')
      .select('*')
      .eq('id', boxId)
      .eq('user_id', userId)
      .single();

    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!box) {
      res.status(404).json({ error: 'Box not found' });
      return;
    }

    res.json(box);
    return;
  } catch (error) {
    console.error('Error fetching box:', error);
    res.status(500).json({ error: 'Failed to fetch box' });
    return;
  }
}) as RequestHandler);

// Create a new box
router.post("/", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, description } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { data: box, error } = await supabase
      .from('boxes')
      .insert([
        {
          name,
          description,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(box);
  } catch (error) {
    console.error('Error creating box:', error);
    res.status(500).json({ error: 'Failed to create box' });
  }
}) as RequestHandler);

// Update a box
router.put("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const boxId = req.params['id'];
    const { name, description } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { data: box, error } = await supabase
      .from('boxes')
      .update({ name, description })
      .eq('id', boxId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!box) {
      res.status(404).json({ error: 'Box not found' });
      return;
    }

    res.json(box);
    return;
  } catch (error) {
    console.error('Error updating box:', error);
    res.status(500).json({ error: 'Failed to update box' });
    return;
  }
}) as RequestHandler);

// Delete a box
router.delete("/:id", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const boxId = req.params['id'];

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { error } = await supabase
      .from('boxes')
      .delete()
      .eq('id', boxId)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting box:', error);
    res.status(500).json({ error: 'Failed to delete box' });
  }
}) as RequestHandler);

// Bulk create flashcards for a box
router.post("/:id/flashcards/bulk", (async (req, res) => {
  try {
    const userId = req.user?.id;
    const boxId = req.params['id'];
    const flashcards = Array.isArray(req.body) ? req.body : req.body.flashcards;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Validate input
    if (!Array.isArray(flashcards)) {
      res.status(400).json({ error: 'Flashcards must be an array' });
      return;
    }

    // First verify the box exists and belongs to the user
    const { data: box, error: boxError } = await supabase
      .from('boxes')
      .select('id')
      .eq('id', boxId)
      .eq('user_id', userId)
      .single();

    if (boxError) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!box) {
      res.status(404).json({ error: 'Box not found' });
      return;
    }

    // Prepare flashcards data with box_id
    const flashcardsData = flashcards.map(flashcard => ({
      ...flashcard,
      box_id: boxId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert flashcards
    const { data: createdFlashcards, error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsData)
      .select();

    if (insertError) {
      res.status(500).json({ error: 'Failed to insert flashcards' });
      return;
    }

    res.status(201).json({
      items: createdFlashcards,
      meta: {
        total: createdFlashcards.length
      }
    });
    return;
  } catch (error) {
    console.error('Error creating bulk flashcards:', error);
    res.status(500).json({ error: 'Failed to create flashcards' });
    return;
  }
}) as RequestHandler);

export default router; 