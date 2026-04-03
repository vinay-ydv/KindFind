import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// We use a Map to keep track of which User ID belongs to which Socket ID
// This lets us send notifications to a user even if they are on a different page!
const userSocketMap = new Map(); 
// not used ////////
// export const initializeSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin:  "", // Your React frontend
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     // console.log(`🔌 New client connected: ${socket.id}`);

//     // 1. REGISTER USER: When a user logs in or opens the app, map their DB ID to their Socket
//     socket.on("register_user", (userId) => {
//       if (userId) {
//         userSocketMap.set(userId, socket.id);
//         // console.log(`👤 User ${userId} is online.`);
//         // Tell everyone else this user is online (for the green dot in the UI)
//         io.emit("user_status_change", { userId, status: "online" });
//       }
//     });

//     // 2. JOIN ROOM: When a user clicks a specific chat in the sidebar
//     socket.on("join_chat", (conversationId) => {
//       socket.join(conversationId);
//       // console.log(`🚪 User joined conversation room: ${conversationId}`);
//     });

//     // 3. SEND MESSAGE: The core chat engine
//     socket.on("send_message", async (data) => {
//       try {
//         const { conversationId, senderId, receiverId, text } = data;

//         // A. Save the exact message to the Database instantly
//         const newMessage = await Message.create({
//           conversationId,
//           sender: senderId,
//           text,
//           status: "sent"
//         });

//         // B. Update the Sidebar (Conversation Document)
//         // We update the last message and increment the unread count for the receiver
//         const updatedConversation = await Conversation.findByIdAndUpdate(
//           conversationId,
//           {
//             lastMessage: text,
//             lastMessageSender: senderId,
//             $inc: { unreadCount: 1 } 
//           },
//           { returnDocument: 'after' } // Returns the updated document
//         );

//         // C. Emit the message to everyone CURRENTLY in the chat room
//         // Because we populate the sender details, the frontend can render the bubble immediately
//         const populatedMessage = await newMessage.populate("sender", "name profileImage");
//         io.to(conversationId).emit("receive_message", populatedMessage);

//         // D. Push Notification / Sidebar Update for the Receiver
//         // If the receiver is online (anywhere in the app), update their sidebar!
//         const receiverSocketId = userSocketMap.get(receiverId);
//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("update_sidebar", {
//             conversationId,
//             lastMessage: text,
//             updatedAt: updatedConversation.updatedAt,
//             unreadCount: updatedConversation.unreadCount
//           });
//         }

//       } catch (error) {
//         console.error("❌ Error sending message:", error);
//         socket.emit("message_error", { error: "Failed to send message" });
//       }
//     });

//     // 4. DISCONNECT: Clean up when they close the tab
//     socket.on("disconnect", () => {
//       // console.log(`🔌 Client disconnected: ${socket.id}`);
//       // Find the user ID based on the socket ID that just disconnected and remove them
//       for (const [userId, socketId] of userSocketMap.entries()) {
//         if (socketId === socket.id) {
//           userSocketMap.delete(userId);
//           // Tell others this user went offline
//           io.emit("user_status_change", { userId, status: "offline" });
//           break;
//         }
//       }
//     });
//   });

//   return io;
// };