import express from "express";
import isAuth from "../middleware/isAuth.js"; // Adjust path if needed
import { getReportById } from "../controllers/matching.controllers.js";


const matchingRouter = express.Router();

// GET matches for a specific item ID
matchingRouter.get("/:id", getReportById);

export default matchingRouter;