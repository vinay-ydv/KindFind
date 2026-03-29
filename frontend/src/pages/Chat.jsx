import React, { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Image, MoreVertical, Phone, Video, Check, CheckCheck } from "lucide-react"
import { Navbar } from "../components/Navbar.jsx"

const mockConversations = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      initials: "SJ",
    },
    item: {
      title: "Golden Retriever - Answers to Max",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
    },
    lastMessage: "I think I saw him near the park yesterday!",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      initials: "MC",
    },
    item: {
      title: "Brown Leather Wallet",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop",
    },
    lastMessage: "Can you describe what was inside?",
    timestamp: "1 hour ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    user: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      initials: "ED",
    },
    item: {
      title: "iPhone 15 Pro Max",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
    },
    lastMessage: "Thank you so much! I really appreciate it.",
    timestamp: "Yesterday",
    unread: 1,
    online: true,
  },
]

const mockMessages = [
  {
    id: 1,
    senderId: "other",
    text: "Hi! I saw your post about the golden retriever. I think I might have seen him!",
    timestamp: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    senderId: "me",
    text: "Oh really? That would be amazing! Where did you see him?",
    timestamp: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    senderId: "other",
    text: "Near the Riverside Park, around the children's playground area. He was with what looked like another dog walker.",
    timestamp: "10:35 AM",
    status: "read",
  },
  {
    id: 4,
    senderId: "me",
    text: "That's great information! Do you remember what time this was?",
    timestamp: "10:36 AM",
    status: "read",
  },
  {
    id: 5,
    senderId: "other",
    text: "It was around 4pm yesterday. He had a blue collar and seemed very friendly - was wagging his tail a lot!",
    timestamp: "10:38 AM",
    status: "read",
  },
  {
    id: 6,
    senderId: "other",
    text: "I think I saw him near the park yesterday!",
    timestamp: "10:40 AM",
    status: "delivered",
  },
]

export function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: "me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <>
    <Navbar />
    
    <div className="h-[calc(100vh-10rem)] bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm">
     
      {/* Conversations List (Sidebar) */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-semibold text-lg text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">3 active conversations</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-3 rounded-lg text-left transition-colors flex items-start gap-3 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* Avatar container */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {conversation.user.avatar ? (
                      <img src={conversation.user.avatar} alt={conversation.user.name} className="h-full w-full object-cover" />
                    ) : (
                      conversation.user.initials
                    )}
                  </div>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">
                      {conversation.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Re: {conversation.item.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {conversation.unread > 0 && (
                  <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-xs font-medium bg-blue-600 text-white mt-1">
                    {conversation.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window (Main Content) */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {selectedConversation?.user.avatar ? (
                  <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} className="h-full w-full object-cover" />
                ) : (
                  selectedConversation?.user.initials
                )}
              </div>
              {selectedConversation?.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedConversation?.user.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <img
                  src={selectedConversation?.item.image}
                  alt="item thumbnail"
                  className="h-4 w-4 rounded object-cover"
                />
                <span className="truncate max-w-[200px]">{selectedConversation?.item.title}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 relative">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
              <Video className="h-4 w-4" />
            </button>
            
            {/* Custom Dropdown Menu */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Item Post</button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mute Notifications</button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">Block User</button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.senderId === "me"
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      message.senderId === "me" ? "justify-end" : ""
                    }`}
                  >
                    <span className={`text-[10px] font-medium ${message.senderId === "me" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp}
                    </span>
                    {message.senderId === "me" && (
                      message.status === "read" ? (
                        <CheckCheck className="h-3 w-3 text-blue-100" />
                      ) : (
                        <Check className="h-3 w-3 text-blue-100" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Image className="h-5 w-5" />
            </button>
            
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2 outline-none transition-all text-sm"
            />
            
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center w-10 h-10"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}