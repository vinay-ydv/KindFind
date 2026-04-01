import React, { useState, useEffect, useContext } from "react";
import { Bell, CheckCircle2, PackageSearch } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { Navbar } from "../components/Navbar.jsx";

// Notice we accept onViewItem so we can open the global modal!
export function Notification({ onViewItem }) {
  const { serverUrl } = useContext(authDataContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/notifications`, { withCredentials: true });
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    fetchNotifications();
  }, [serverUrl]);

  const handleNotificationClick = async (notification) => {
    // 1. Mark as read in DB
    if (!notification.isRead) {
      await axios.put(`${serverUrl}/api/notifications/${notification._id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
    }
    
    // 2. Open the global ItemDetail Modal!
    if (notification.item) {
      onViewItem(notification.item);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Bell className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Notifications</h1>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
              No notifications yet. We'll alert you when a match is found!
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  notif.isRead ? "bg-white border-gray-200 hover:bg-gray-50" : "bg-blue-50 border-blue-200 hover:bg-blue-100 shadow-sm"
                }`}
              >
                <div className={`p-2 rounded-full mt-1 ${notif.isRead ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600"}`}>
                  <PackageSearch className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm ${notif.isRead ? "text-gray-900" : "text-blue-900 font-semibold"}`}>
                    {notif.message}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                {!notif.isRead && <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-2"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}