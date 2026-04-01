import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Which conversation box this message belongs to
    conversationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Conversation", 
      required: true 
    },
    
    // The person who sent the text
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    // The actual message
    text: { 
      type: String, 
      required: true 
    },
    
    // Status for the checkmarks in your UI (sent vs read)
    status: { 
      type: String, 
      enum: ["sent", "delivered", "read"], 
      default: "sent" 
    }
  },
  { 
    timestamps: true 
    // `createdAt` is used to order the messages sequentially in the chat window
  }
);

// Index to quickly pull all messages for a specific chat room
messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;