import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// 1. Fetch all conversations for the sidebar
export const getUserConversations = async (req, res) => {
  try {
    // Find all conversations where the logged-in user is a participant
    const conversations = await Conversation.find({ participants: req.userId })
      .populate("participants", "name profileImage") // Get user details
      .populate("item", "title image")               // Get item details
      .sort({ updatedAt: -1 });                      // Sort newest chats to the top!

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("[getUserConversations] Error:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

// 2. Fetch all messages for a specific chat window
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Security check: Make sure the user is actually part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized to view this chat" });
    }

    // Reset unread count since the user is now viewing it
    if (conversation.lastMessageSender?.toString() !== req.userId.toString()) {
      await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });
    }

 // Find this block in your chat.controllers.js:
    const messages = await Message.find({ conversationId })
      .populate("sender", "name profileImage") // <--- ADD THIS EXACT LINE
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("[getConversationMessages] Error:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// 3. Init or Get a Chat (Triggered when clicking "Contact Reporter")
export const initConversation = async (req, res) => {
  try {
    const { itemId, reporterId } = req.body;
    const viewerId = req.userId;

    if (reporterId === viewerId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Check if they already have an ongoing chat about this specific item
    let conversation = await Conversation.findOne({
      participants: { $all: [viewerId, reporterId] },
      item: itemId
    }).populate("participants", "name profileImage").populate("item", "title image");

    // If no chat exists, create a brand new one
    if (!conversation) {
      const newConversation = await Conversation.create({
        participants: [viewerId, reporterId],
        item: itemId,
        lastMessage: "Started a conversation..."
      });

      // Populate it so the frontend can render it immediately
      conversation = await Conversation.findById(newConversation._id)
        .populate("participants", "name profileImage")
        .populate("item", "title image");
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error("[initConversation] Error:", error);
    return res.status(500).json({ message: "Failed to initialize conversation" });
  }
};