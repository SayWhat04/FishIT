import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/environment';


const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceKey;

if (!supabaseUrl || supabaseUrl === '') {
  console.error('CRITICAL: You need to set the SUPABASE_URL environment variable');
}

if (!supabaseKey || supabaseKey === '') {
  console.error('CRITICAL: You need to set the SUPABASE_SERVICE_KEY environment variable');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Express middleware to handle JWT auth
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authentication token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the JWT with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // Add user data to request for downstream handlers
    (req as any).user = {
      id: data.user.id,
      email: data.user.email
    };
    
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}; 