import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes';
import { environment } from './config/environment';

const app = express();
const PORT = environment.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
