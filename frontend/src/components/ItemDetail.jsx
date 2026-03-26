import React, { useEffect } from "react"
import { X, MapPin, Calendar, Tag, User, MessageSquare, Sparkles, ArrowRight } from "lucide-react"

export function ItemDetail({ item, isOpen, onClose, onViewMatch, onContactUser }) {
  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Don't render anything if the modal shouldn't be open or if there's no item
  if (!isOpen || !item) return null

  const statusColors = {
    lost: "bg-red-500 text-white",
    found: "bg-green-500 text-white",
  }

  // Fallback to 'lost' color if the status text isn't formatted right
  const badgeColor = statusColors[item?.status?.toLowerCase()] || statusColors.lost

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose} // Clicking the background closes the modal
    >
      {/* Modal Container - stopPropagation prevents closing when clicking the card itself */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Match Alert Banner */}
        {item.potentialMatch && (
          <div className="m-4 mb-0 border border-yellow-300 bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <h4 className="text-yellow-800 font-semibold">Match Found!</h4>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              We noticed a high similarity with another user's post. This could be your match!
            </p>
            <div className="flex gap-2 mt-3">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-yellow-400 text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
                onClick={onViewMatch}
              >
                View Match
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700 rounded-md transition-colors shadow-sm"
                onClick={onContactUser}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Contact User
              </button>
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className={`relative aspect-video w-full overflow-hidden bg-gray-100 ${!item.potentialMatch ? 'mt-0' : 'mt-4'}`}>
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          {/* Status Badge */}
          <span className={`absolute top-4 left-4 ${badgeColor} px-3 py-1 rounded-full uppercase text-sm font-bold shadow-md`}>
            {item.status}
          </span>
          {/* Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 text-xs font-medium">
                {item.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
          </div>

          {/* Reporter Info */}
          <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reported by John D.</p>
              <p className="text-xs text-gray-500">Member since Jan 2024</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              onClick={onContactUser}
            >
              <MessageSquare className="h-4 w-4" />
              Contact Reporter
            </button>
            <button
              className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}