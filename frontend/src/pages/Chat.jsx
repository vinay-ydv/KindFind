import React, { useState, useRef, useEffect, useContext } from "react";
// Added ArrowLeft for the mobile back button
import { Send, Paperclip, Image as ImageIcon, MoreVertical, Video, Check, CheckCheck, User, MessageSquare, ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar.jsx";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import io from "socket.io-client";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/UserContext.jsx"; 

export function Chat() {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Add this near useLocation()
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  
  const { itemId, reporterId, viewerId, itemDetails } = location.state || {}; 
  const currentUserId = userData?._id || viewerId; 

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==========================================
  // 1. INITIALIZE SOCKET.IO
  // ==========================================
  useEffect(() => {
    if (!serverUrl || !currentUserId) return;

    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("register_user", currentUserId);
    });

    return () => newSocket.close();
  }, [serverUrl, currentUserId]);

  // ==========================================
  // 2. FETCH INITIAL DATA (REST API)
  // ==========================================
  useEffect(() => {
    const initializeData = async () => {
      if (!currentUserId) return;

      try {
        const res = await axios.get(`${serverUrl}/api/chat/conversations`, { withCredentials: true });
        let loadedConversations = res.data.conversations;

        if (itemId && reporterId && currentUserId && itemDetails) {
          const initRes = await axios.post(`${serverUrl}/api/chat/conversations/init`, 
            { itemId, reporterId }, 
            { withCredentials: true }
          );
          
          const specificChat = initRes.data.conversation;
          setSelectedConversation(specificChat);
          
          const msgRes = await axios.get(`${serverUrl}/api/chat/conversations/${specificChat._id}/messages`, { withCredentials: true });
          setMessages(msgRes.data.messages);
          
          const filtered = loadedConversations.filter(c => c._id !== specificChat._id);
          setConversations([specificChat, ...filtered]);

        } else {
          setConversations(loadedConversations);
          
          // Optionally auto-select the most recent chat on desktop only
          if (loadedConversations.length > 0 && window.innerWidth >= 768) {
            handleSelectConversation(loadedConversations[0]);
          }
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
      }
    };

    initializeData();
  }, [itemId, reporterId, currentUserId, serverUrl]);

  // ==========================================
  // 3. HANDLE SOCKET EVENTS (RECEIVING MESSAGES)
  // ==========================================
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        if (message.sender._id !== currentUserId) {
           setMessages(prev => [...prev, message]);
        }
      }
    };

    const handleUpdateSidebar = (data) => {
      setConversations(prev => {
        const chatIndex = prev.findIndex(c => c._id === data.conversationId);
        if (chatIndex !== -1) {
          const updatedChats = [...prev];
          updatedChats[chatIndex].lastMessage = data.lastMessage;
          updatedChats[chatIndex].unreadCount = data.unreadCount;
          updatedChats[chatIndex].updatedAt = data.updatedAt;
          
          const [movedChat] = updatedChats.splice(chatIndex, 1);
          return [movedChat, ...updatedChats];
        }
        return prev;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("update_sidebar", handleUpdateSidebar);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_sidebar", handleUpdateSidebar);
    };
  }, [socket, selectedConversation, currentUserId]);

  useEffect(() => {
    if (socket && selectedConversation) {
      socket.emit("join_chat", selectedConversation._id);
    }
  }, [socket, selectedConversation]);

  // ==========================================
  // 4. UI HANDLERS
  // ==========================================
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const msgRes = await axios.get(`${serverUrl}/api/chat/conversations/${conversation._id}/messages`, { withCredentials: true });
      setMessages(msgRes.data.messages);
      
      setConversations(prev => prev.map(c => c._id === conversation._id ? { ...c, unreadCount: 0 } : c));
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const receiverId = selectedConversation.participants.find(p => p._id !== currentUserId)?._id;

    const tempMsg = {
      _id: Date.now(),
      sender: { _id: currentUserId }, 
      text: newMessage,
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    socket.emit("send_message", {
      conversationId: selectedConversation._id,
      senderId: currentUserId,
      receiverId: receiverId,
      text: tempMsg.text
    });

    setConversations(prev => {
      const filtered = prev.filter(c => c._id !== selectedConversation._id);
      const updatedChat = { ...selectedConversation, lastMessage: tempMsg.text };
      return [updatedChat, ...filtered]; 
    });
  };

  const getOtherUser = (chat) => {
    if (!chat || !chat.participants) return {};
    return chat.participants.find(p => p._id !== currentUserId) || {};
  };
const handleStartVideoCall = () => {
    if (!selectedConversation) return;
    
    // We use the conversation ID as the secure video room ID
    const roomId = selectedConversation._id;
    const callLink = `${window.location.origin}/video-call/${roomId}`;

    // 1. Auto-send a message with the link so the other person can join
    const receiverId = getOtherUser(selectedConversation)._id;
    const autoMessage = `🎥 I started a video call! Join here: ${callLink}`;

    // Optimistic UI update
    const tempMsg = {
      _id: Date.now(),
      sender: { _id: currentUserId },
      text: autoMessage,
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Send to backend socket
    socket.emit("send_message", {
      conversationId: selectedConversation._id,
      senderId: currentUserId,
      receiverId: receiverId,
      text: autoMessage
    });

    // 2. Navigate the caller to the video room
    navigate(`/video-call/${roomId}`);
  };
  return (
    <>
      <Navbar />
      {/* Set a consistent height across mobile and desktop */}
      <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] bg-white md:border border-gray-200 md:rounded-xl overflow-hidden flex shadow-sm max-w-7xl mx-auto md:mt-4">
        
        {/* ============================== */}
        {/* SIDEBAR: Hidden on mobile IF a chat is selected */}
        {/* ============================== */}
        <div className={`border-r border-gray-200 flex-col bg-gray-50/50 flex-shrink-0 transition-all duration-300 
          ${selectedConversation ? 'hidden md:flex' : 'flex w-full'} 
          md:w-80 lg:w-96`}
        >
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-semibold text-lg text-gray-900">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No conversations yet.</div>
            ) : (
              conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                
                return (
                  <button
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-3 rounded-lg text-left transition-colors flex items-start gap-3 ${
                      selectedConversation?._id === conversation._id ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {otherUser.profileImage ? (
                          <img src={otherUser.profileImage} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 truncate">{otherUser.name || "User"}</span>
                      </div>
                      <p className="text-xs text-blue-600 truncate font-medium">Re: {conversation.item?.title}</p>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    
                    {conversation.unreadCount > 0 && conversation.lastMessageSender !== currentUserId && (
                      <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-xs font-medium bg-blue-600 text-white mt-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* CHAT AREA: Hidden on mobile IF NO chat is selected */}
        {/* ============================== */}
        <div className={`flex-1 flex-col bg-white transition-all duration-300 
          ${!selectedConversation ? 'hidden md:flex' : 'flex w-full'}`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                  
                  {/* MOBILE BACK BUTTON */}
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 -ml-2 mr-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="h-10 w-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {getOtherUser(selectedConversation).profileImage ? (
                        <img src={getOtherUser(selectedConversation).profileImage} alt="avatar" className="h-full w-full object-cover" />
                    ) : <User className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{getOtherUser(selectedConversation).name || "User"}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      {selectedConversation.item?.image && <img src={selectedConversation.item.image} alt="item" className="h-4 w-4 rounded object-cover flex-shrink-0" />}
                      <span className="truncate">Discussing: {selectedConversation.item?.title}</span>
                    </div>
                  </div>
                </div>
               <button 
  onClick={handleStartVideoCall} 
  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex-shrink-0"
>
  <Video className="h-5 w-5" />
</button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-center px-4">Send a message to ask about the {selectedConversation.item?.title}</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const messageSenderId = msg.sender?._id || msg.sender;
                  const isMe = messageSenderId === currentUserId;
                  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"}`}>
                        <p className="text-sm break-words">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                          <span className={`text-[10px] font-medium ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2.5 outline-none text-sm"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 text-gray-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}