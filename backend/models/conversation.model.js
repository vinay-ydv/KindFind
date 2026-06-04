import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    
    participants: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      }
    ],
    
    
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Report", 
      required: true 
    },
    

    lastMessage: { 
      type: String,
      default: "Start a conversation..."
    },

    
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

   
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
    
  }
);


conversationSchema.index({ participants: 1, item: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;