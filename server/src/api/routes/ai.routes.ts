import express, { RequestHandler } from "express";
import { AIService } from "../../services/AIService";
import { auth } from "../middlewares/auth.middleware";
import rateLimit from "express-rate-limit";
import { validateGenerateFlashcards } from "../validators/ai.validators";

const router = express.Router();
const aiService = new AIService();

// Apply rate limiting to all AI routes
const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: "Too many requests, please try again later",
});

// router.use(auth as unknown as RequestHandler);
router.use(aiRateLimiter as unknown as RequestHandler);

// POST /ai/flashcards - Generate flashcards from text
router.post("/flashcards", validateGenerateFlashcards as unknown as RequestHandler, async (req, res) => {
  try {
    // Extract validated data from request body
    const { text, count } = req.body;
    
    // Call the AI service to generate flashcards
    const result = await aiService.generateFlashcards({ text, count });
    
    // Return the flashcard suggestions
    res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        res.status(429).json({ error: 'Too many requests to AI service. Please try again later.' });
        return;
      } else if (error.message.includes('OPENROUTER_API_KEY is not configured')) {
        res.status(500).json({ error: 'Internal server configuration error' });
        return;
      }
    }
    
    // Default error response
    res.status(500).json({ 
      error: 'Failed to generate flashcards',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 