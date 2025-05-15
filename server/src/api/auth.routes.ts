// @ts-nocheck
import express, { Router } from 'express';
import { supabase } from '../db/supabase.client';
import { AuthError } from '@supabase/supabase-js';

const router = Router();

/**
 * Login user with email and password
 * @route POST /api/auth/login
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  supabase.auth.signInWithPassword({
    email,
    password,
  }).then(({ data, error }) => {
    if (error) {
      console.error('Login error:', error);
      return handleAuthError(error, res);
    }

    if (!data.session) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    return res.status(200).json({
      token: data.session.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    });
  }).catch(error => {
    console.error('Unexpected error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  });
});

/**
 * Register a new user
 * @route POST /api/auth/register
 */
router.post('/register', (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || email.split('@')[0], // Use username if provided or default to email prefix
      }
    }
  }).then(({ data, error }) => {
    if (error) {
      console.error('Registration error:', error);
      return handleAuthError(error, res);
    }

    if (data.session) {
      return res.status(200).json({
        token: data.session.access_token,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          username: data.user?.user_metadata?.username
        }
      });
    }

    return res.status(200).json({ 
      message: 'Registration successful. Please check your email to confirm your account.'
    });
  }).catch(error => {
    console.error('Unexpected error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  });
});

/**
 * Logout user
 * @route POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  supabase.auth.signOut().then(({ error }) => {
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
    return res.status(200).json({ message: 'Logged out successfully' });
  }).catch(error => {
    console.error('Unexpected error during logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  });
});

/**
 * Check if user is authenticated
 * @route GET /api/auth/session
 */
router.get('/session', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ authenticated: false });
  }
  
  const token = authHeader.split(' ')[1];
  
  supabase.auth.getUser(token).then(({ data, error }) => {
    if (error || !data.user) {
      return res.status(200).json({ authenticated: false });
    }
    
    return res.status(200).json({ authenticated: true });
  }).catch(error => {
    console.error('Session verification error:', error);
    return res.status(200).json({ authenticated: false });
  });
});

// Helper function to handle Supabase Auth errors
function handleAuthError(error: AuthError, res: express.Response) {
  switch (error.status) {
    case 400:
      return res.status(400).json({ message: error.message });
    case 401:
      return res.status(401).json({ message: 'Invalid credentials' });
    case 403:
      return res.status(403).json({ message: 'Access forbidden' });
    case 404:
      return res.status(404).json({ message: 'User not found' });
    case 422:
      return res.status(422).json({ message: error.message });
    case 429:
      return res.status(429).json({ message: 'Too many requests' });
    default:
      return res.status(500).json({ message: 'Authentication error' });
  }
}

export default router; 