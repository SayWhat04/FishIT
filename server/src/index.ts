import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import winston from 'winston';
import apiRoutes from './api/routes';
import { config } from './config/environment';
import { Request, Response, NextFunction } from 'express';

// Konfiguracja Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  logger.info('===== HEALTH CHECK ENDPOINT CALLED =====');
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { error: err });
  
  // Don't expose internal server errors to client
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';
  
  res.status(statusCode).json({
    status: 'error',
    message
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check available at: http://localhost:${PORT}/health`);
});
