import express from "express";
const router = express.Router();

// Import route modules
import aiRoutes from "./ai.routes";
import boxesRoutes from "./boxes.routes";

// Register routes
router.use("/ai", aiRoutes);
router.use("/boxes", boxesRoutes);

export default router; 