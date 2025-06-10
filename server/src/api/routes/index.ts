import express from "express";
const router = express.Router();

import aiRoutes from "./ai.routes";
import boxesRoutes from "./boxes.routes";
import flashcardsRoutes from "./flashcards.routes";

router.use("/ai", aiRoutes);
router.use("/boxes", boxesRoutes);
router.use("/flashcards", flashcardsRoutes);

export default router; 