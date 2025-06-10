import request from 'supertest';
import express from 'express';

describe('Sample Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});

describe('API Tests', () => {
  const app = express();
  
  app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test endpoint' });
  });

  it('should return 200 for test endpoint', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test endpoint');
  });
}); 