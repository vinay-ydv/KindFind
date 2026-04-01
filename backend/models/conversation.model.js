import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // The two users in the chat (The Reporter and the Viewer)
    participants: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      }
    ],
    
    // The specific item they are discussing
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Report", 
      required: true 
    },
    
    // A snippet of the most recent message to display in the sidebar
    lastMessage: { 
      type: String,
      default: "Start a conversation..."
    },

    // Keeps track of who sent the last message to handle unread notifications
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // How many messages the OTHER person hasn't read yet
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
    // timestamps automatically adds `createdAt` and `updatedAt`. 
    // `updatedAt` is crucial so you can sort the sidebar to show the most recently active chats at the top!
  }
);

// Add an index to make finding chats between two users about a specific item lightning fast
conversationSchema.index({ participants: 1, item: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;