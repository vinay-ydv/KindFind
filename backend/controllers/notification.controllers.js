import Notification from "../models/notification.model.js";

// Fetch all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate("sender", "name profileImage")
      .populate("item") // Populate the item so we can open the ItemDetail modal!
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};