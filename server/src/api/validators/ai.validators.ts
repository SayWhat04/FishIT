import { Request, Response, NextFunction } from 'express';

interface GenerateFlashcardsCommand {
  text: string;
  count: number;
}

export const validateGenerateFlashcards = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, count } = req.body as Partial<GenerateFlashcardsCommand>;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string' });
    }
    
    if (text.length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }
    
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text cannot exceed 5000 characters' });
    }
    
    if (count === undefined) {
      return res.status(400).json({ error: 'Count is required' });
    }
    
    if (typeof count !== 'number') {
      return res.status(400).json({ error: 'Count must be a number' });
    }
    
    if (!Number.isInteger(count)) {
      return res.status(400).json({ error: 'Count must be an integer' });
    }
    
    if (count < 1 || count > 50) {
      return res.status(400).json({ error: 'Count must be between 1 and 50' });
    }

    next();
    return undefined;
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ error: 'Internal server error during validation' });
  }
}; 