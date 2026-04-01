import express from "express";
import isAuth from "../middleware/isAuth.js"; // Your authentication middleware
import { 
    getUserConversations, 
    getConversationMessages, 
    initConversation 
} from "../controllers/chat.controllers.js";

const chatRouter = express.Router();

// Apply auth middleware to all chat routes (must be logged in to chat)
chatRouter.use(isAuth); 

// Sidebar route
chatRouter.get("/conversations", getUserConversations);

// Initialize chat route
chatRouter.post("/conversations/init", initConversation);

// Messages route
chatRouter.get("/conversations/:conversationId/messages", getConversationMessages);

export default chatRouter;