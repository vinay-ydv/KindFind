import express from "express"
import http from "http"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { Server } from "socket.io"

import authRouter from "./routes/auth.routes.js"
import isAuth from "./middleware/isAuth.js"
import { getCurrentUser } from "./controllers/user.controller.js"
import reportRouter from "./routes/report.routes.js"
import matchingRouter from "./routes/matching.routes.js"

// NOTE: I am importing your models here directly so the Socket logic works
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";
import chatRouter from "./routes/chat.routes.js"
import notificationRouter from "./routes/notification.routes.js"

dotenv.config()
const app = express()
const server = http.createServer(app);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["https://kindfind-frontend.onrender.com"],
    credentials: true
}))

// =========================================================================
// SOCKET.IO LOGIC INJECTED DIRECTLY INTO INDEX.JS
// =========================================================================
const io = new Server(server, {
  cors: {
    // origin:  "https://kindfind-frontend.onrender.com",
    origin:  "https://kindfind-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map(); 

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("register_user", (userId) => {
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`👤 User ${userId} is online.`);
      io.emit("user_status_change", { userId, status: "online" });
    }
  });

  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
    console.log(`🚪 User joined conversation room: ${conversationId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, receiverId, text } = data;

      // Create message in DB
      const newMessage = await Message.create({
        conversationId,
        sender: senderId,
        text,
        status: "sent"
      });

      // Update sidebar details
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: text,
          lastMessageSender: senderId,
          $inc: { unreadCount: 1 } 
        },
        { returnDocument: 'after' } 
      );

      // Emit to the room
      const populatedMessage = await newMessage.populate("sender", "name profileImage");
      io.to(conversationId).emit("receive_message", populatedMessage);

      // Notify the receiver if they are online
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("update_sidebar", {
          conversationId,
          lastMessage: text,
          updatedAt: updatedConversation.updatedAt,
          unreadCount: updatedConversation.unreadCount
        });
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        io.emit("user_status_change", { userId, status: "offline" });
        break;
      }
    }
  });
});

app.set("io", io);
// =========================================================================

let port = process.env.PORT || 5000

app.use("/api/auth", authRouter)
app.get("/currentuser", isAuth, getCurrentUser)
app.use("/api/report", reportRouter);
app.use("/api/matching",isAuth, matchingRouter);
app.use("/api/chat",isAuth, chatRouter)
app.use("/api/notifications",isAuth, notificationRouter)

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

server.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`);
})