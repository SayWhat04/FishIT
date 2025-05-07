import express, { RequestHandler } from "express";
import { supabase } from "../../db/supabase.client";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

// Apply auth middleware to all box routes
router.use(auth as unknown as RequestHandler);

// Get all boxes for the current user
router.get("/", (async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
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
    const userId = (req as any).user.id;
    const boxId = req.params['id'];

    const { data: box, error } = await supabase
      .from('boxes')
      .select('*')
      .eq('id', boxId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!box) {
      return res.status(404).json({ error: 'Box not found' });
    }

    res.json(box);
  } catch (error) {
    console.error('Error fetching box:', error);
    res.status(500).json({ error: 'Failed to fetch box' });
  }
}) as RequestHandler);

// Create a new box
router.post("/", (async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { name, description } = req.body;

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
    const userId = (req as any).user.id;
    const boxId = req.params['id'];
    const { name, description } = req.body;

    const { data: box, error } = await supabase
      .from('boxes')
      .update({ name, description })
      .eq('id', boxId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!box) {
      return res.status(404).json({ error: 'Box not found' });
    }

    res.json(box);
  } catch (error) {
    console.error('Error updating box:', error);
    res.status(500).json({ error: 'Failed to update box' });
  }
}) as RequestHandler);

// Delete a box
router.delete("/:id", (async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const boxId = req.params['id'];

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

export default router; 