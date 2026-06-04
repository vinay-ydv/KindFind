import express from "express";
import isAuth from "../middleware/isAuth.js"; 
import { 
    getUserConversations, 
    getConversationMessages, 
    initConversation 
} from "../controllers/chat.controllers.js";

const chatRouter = express.Router();


chatRouter.get("/conversations", getUserConversations);


chatRouter.post("/conversations/init", initConversation);


chatRouter.get("/conversations/:conversationId/messages", getConversationMessages);

export default chatRouter;