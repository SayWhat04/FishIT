// Simple types for the box commands
export interface CreateBoxCommand {
  name: string;
  description?: string | null;
}

export interface UpdateBoxCommand {
  name?: string;
  description?: string | null;
}

// Types for the request user (needed by controllers)
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        [key: string]: any;
      }
    }
  }
} 