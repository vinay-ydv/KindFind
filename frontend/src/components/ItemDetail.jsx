import React, { useEffect, useContext } from "react"
import { X, MapPin, Calendar, Tag, User, MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { userDataContext } from "../context/UserContext.jsx" // 1. Import Context

export function ItemDetail({ item, isOpen, onClose }) {
  const navigate = useNavigate();
  const { userData } = useContext(userDataContext); // 2. Get logged-in user data

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !item) return null

  const statusColors = {
    lost: "bg-red-500 text-white",
    found: "bg-green-500 text-white",
  }

  const badgeColor = statusColors[item?.reportType?.toLowerCase()] || statusColors.lost

  // 3. Securely navigate and pass state to the Chat page
  const handleContactReporter = () => {
    if (!item || !userData) return;

    onClose(); // Close the modal first

    // Notice we use /messages to match your App.jsx routes!
    navigate("/messages", { 
      state: {
        itemId: item._id,           // MongoDB Item ID
        reporterId: item.author._id,// The person who posted it
        viewerId: userData._id,     // The person currently logged in
        itemDetails: item           // We pass the whole item so Chat can display its image/title!
      }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="relative w-full bg-gray-900 flex justify-center overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full max-h-[50vh] object-contain block" />
          <span className={`absolute top-4 left-4 ${badgeColor} px-3 py-1 rounded-full uppercase text-sm font-bold shadow-md`}>
            {item.reportType}
          </span>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{item.location}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>{new Date(item.date).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-1.5"><Tag className="h-4 w-4" /><span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 text-xs font-medium">{item.category}</span></div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
              {item.author?.profileImage ? (
                <img src={item.author.profileImage} alt={item.author.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reported by {item.author?.name || "Unknown User"}</p>
              <p className="text-xs text-gray-500">Reported on {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {/* 4. Hide contact button if the user is looking at their OWN post */}
            {userData && item.author && userData._id !== item.author._id && (
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                onClick={handleContactReporter}
              >
                <MessageSquare className="h-4 w-4" /> Contact Reporter
              </button>
            )}
            <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}