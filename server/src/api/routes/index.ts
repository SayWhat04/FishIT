import express from "express";
const router = express.Router();

// Import route modules
import aiRoutes from "./ai.routes";
import boxesRoutes from "./boxes.routes";
import flashcardsRoutes from "./flashcards.routes";

// Register routes
router.use("/ai", aiRoutes);
router.use("/boxes", boxesRoutes);
router.use("/flashcards", flashcardsRoutes);

export default router; 