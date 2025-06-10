import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import winston from 'winston';
import apiRoutes from './api/routes';
import { config } from './config/environment';
import { Request, Response, NextFunction } from 'express';
import authRoutes from './api/auth.routes';

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

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api", apiRoutes);
app.use('/api/auth', authRoutes);

app.get("/health", (req, res) => {
  logger.info('===== HEALTH CHECK ENDPOINT CALLED =====');
  res.json({ status: "ok" });
});

app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { error: err });
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';
  
  res.status(statusCode).json({
    status: 'error',
    message
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check available at: http://localhost:${PORT}/health`);
});
