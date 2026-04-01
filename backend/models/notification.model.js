import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // The person whose item triggered the match
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    // The actual item that was matched
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Report" 
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);