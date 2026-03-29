import React, { useState, useEffect } from "react"
import { Search, CheckCircle2, XCircle, Sparkles, ArrowLeft, MessageCircle, Plus } from "lucide-react"
import { ItemCard } from "../components/ItemCard.jsx" 
import { Navbar } from "../components/Navbar.jsx"

// Simulated database of existing items
const existingItems = [
  {
    id: 1,
    title: "Brown Leather Wallet",
    description: "Coach brand wallet with credit cards",
    location: "Downtown Bus Stop",
    date: "Mar 24, 2026",
    category: "Wallets",
    status: "found",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
    keywords: ["wallet", "leather", "brown", "coach"],
  },
  {
    id: 2,
    title: "Golden Retriever - Max",
    description: "Friendly golden retriever with blue collar",
    location: "Central Park Area",
    date: "Mar 23, 2026",
    category: "Pets",
    status: "lost",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    keywords: ["dog", "golden", "retriever", "pet"],
  },
  {
    id: 3,
    title: "iPhone 15 Pro",
    description: "Space black iPhone with cracked screen protector",
    location: "Coffee Shop on 5th Ave",
    date: "Mar 22, 2026",
    category: "Electronics",
    status: "found",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    keywords: ["iphone", "phone", "apple", "electronics"],
  },
  {
    id: 4,
    title: "Set of House Keys",
    description: "3 silver keys with a red keychain",
    location: "Library Entrance",
    date: "Mar 21, 2026",
    category: "Keys",
    status: "found",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop",
    keywords: ["keys", "house", "keychain"],
  },
  {
    id: 5,
    title: "Black Backpack",
    description: "North Face backpack with laptop inside",
    location: "University Campus",
    date: "Mar 20, 2026",
    category: "Bags",
    status: "lost",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    keywords: ["backpack", "bag", "black", "north face"],
  },
]

export function Matching({ submittedItem, onBack, onViewItem, onContactUser, onBrowse }) {
  const [matchingPhase, setMatchingPhase] = useState("analyzing") // analyzing, searching, complete
  const [progress, setProgress] = useState(0)
  const [matchedItems, setMatchedItems] = useState([])
  const [itemAdded, setItemAdded] = useState(false)

  useEffect(() => {
    // Simulate the matching process
    const runMatching = async () => {
      // Phase 1: Analyzing
      setMatchingPhase("analyzing")
      for (let i = 0; i <= 30; i += 5) {
        await new Promise(r => setTimeout(r, 100))
        setProgress(i)
      }

      // Phase 2: Searching
      setMatchingPhase("searching")
      for (let i = 30; i <= 70; i += 5) {
        await new Promise(r => setTimeout(r, 100))
        setProgress(i)
      }

      // Phase 3: Complete - find matches based on keywords
      const matches = findMatches(submittedItem)
      
      for (let i = 70; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 80))
        setProgress(i)
      }

      setMatchedItems(matches)
      setItemAdded(true)
      setMatchingPhase("complete")
    }

    runMatching()
  }, [submittedItem])

  const findMatches = (item) => {
    if (!item) return []
    
    const searchTerms = [
      item.title?.toLowerCase(),
      item.description?.toLowerCase(),
      item.category?.toLowerCase(),
    ].filter(Boolean).join(" ")

    // Look for opposite status items (if user lost something, look in found items and vice versa)
    const oppositeStatus = item.reportType === "lost" ? "found" : "lost"
    
    return existingItems.filter(existingItem => {
      if (existingItem.status !== oppositeStatus) return false
      
      // Check for keyword matches
      const hasMatch = existingItem.keywords.some(keyword => 
        searchTerms.includes(keyword)
      ) || existingItem.category.toLowerCase() === item.category?.toLowerCase()
      
      return hasMatch
    })
  }

  const getPhaseMessage = () => {
    switch (matchingPhase) {
      case "analyzing":
        return "Analyzing your item details..."
      case "searching":
        return "Searching through existing reports..."
      case "complete":
        return matchedItems.length > 0 ? "Potential matches found!" : "Search complete"
      default:
        return "Processing..."
    }
  }

  return (
    <>
    
    <Navbar />
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* Header */}
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finding Matches</h1>
          <p className="text-gray-500">
            Looking for potential matches for your {submittedItem?.reportType || "reported"} item
          </p>
        </div>
      </div>

      {/* Submitted Item Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Your Reported Item</h3>
        </div>
        <div className="p-4 pt-0">
          <div className="flex gap-4">
            {submittedItem?.image && (
              <img
                src={submittedItem.image}
                alt={submittedItem.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{submittedItem?.title || "Untitled Item"}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {submittedItem?.description || "No description provided"}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">
                  {submittedItem?.category || "Uncategorized"}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold ${
                  submittedItem?.reportType === "lost" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {submittedItem?.reportType || "reported"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Progress */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {matchingPhase !== "complete" ? (
                  <div className="relative">
                    <Search className="h-5 w-5 text-blue-600 animate-pulse" />
                  </div>
                ) : matchedItems.length > 0 ? (
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                <span className="font-medium text-gray-900">{getPhaseMessage()}</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">{progress}%</span>
            </div>
            {/* Custom Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {matchingPhase === "complete" && (
        <div className="space-y-4">
          {matchedItems.length > 0 ? (
            <>
              {/* Match Found Alert */}
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-900">
                      {matchedItems.length} Potential Match{matchedItems.length > 1 ? "es" : ""} Found!
                    </h3>
                  </div>
                  <p className="text-sm text-yellow-800">
                    We found items that might match what you're looking for. Review them below.
                  </p>
                </div>
              </div>

              {/* Matched Items Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {matchedItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <ItemCard 
                      item={{...item, potentialMatch: true}} 
                      onClick={() => onViewItem(item)} 
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <button 
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onContactUser(item)
                        }}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* No Match Found */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <XCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No Matches Found Yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4 text-sm">
                    We couldn't find any matching items in our database right now. 
                    Don't worry - your item has been added to our system!
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Item Added Confirmation */}
          {itemAdded && (
            <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-900">Item Added to Database</h3>
                    <p className="text-sm text-green-800 mt-1">
                      Your report has been saved. We'll notify you immediately if someone reports a matching item.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Report Another Item
            </button>
            <button 
              onClick={onBrowse}
              className="flex-1 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Browse All Items
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}