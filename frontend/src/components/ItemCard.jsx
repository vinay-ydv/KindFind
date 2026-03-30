import React from "react"
import { MapPin, Calendar, Sparkles } from "lucide-react"

export function ItemCard({ item, onClick }) {
  const statusColors = {
    lost: "bg-red-500 text-white",
    found: "bg-green-500 text-white",
  }

  // CHANGE: Use reportType instead of status
  const badgeColor = statusColors[item?.reportType?.toLowerCase()] || statusColors.lost

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-blue-500/20"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge - CHANGE: Display reportType */}
        <span className={`absolute top-3 left-3 ${badgeColor} px-2.5 py-1 rounded-full uppercase text-xs font-semibold shadow-sm`}>
          {item.reportType}
        </span>

        {/* Potential Match Badge */}
        {item.potentialMatch && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-yellow-900 shadow-md">
            <Sparkles className="h-3 w-3" />
            Potential Match!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        
        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
            {/* CHANGE: Format the MongoDB date string */}
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="mt-4">
          <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  )
}