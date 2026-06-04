import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const getUserConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({ participants: req.userId })
      .populate("participants", "name profileImage") 
      .populate("item", "title image")               
      .sort({ updatedAt: -1 });                     

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("[getUserConversations] Error:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};


export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

  
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized to view this chat" });
    }


    if (conversation.lastMessageSender?.toString() !== req.userId.toString()) {
      await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });
    }


    const messages = await Message.find({ conversationId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("[getConversationMessages] Error:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export const initConversation = async (req, res) => {
  try {
    const { itemId, reporterId } = req.body;
    const viewerId = req.userId;

    if (reporterId === viewerId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [viewerId, reporterId] },
      item: itemId
    }).populate("participants", "name profileImage").populate("item", "title image");


    if (!conversation) {
      const newConversation = await Conversation.create({
        participants: [viewerId, reporterId],
        item: itemId,
        lastMessage: "Started a conversation..."
      });


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