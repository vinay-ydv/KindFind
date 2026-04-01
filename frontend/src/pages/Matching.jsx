import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Search, CheckCircle2, XCircle, Sparkles, ArrowLeft, MessageCircle, Plus, Loader2, User } from "lucide-react"
import { ItemCard } from "../components/ItemCard.jsx" 
import { Navbar } from "../components/Navbar.jsx"
import { authDataContext } from "../context/AuthContext.jsx" 
import { userDataContext } from "../context/UserContext.jsx" // <-- ADDED: Need this for chat routing

export function Matching({ onBack, onViewItem, onContactUser, onBrowse }) {
  const { id } = useParams() 
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext) // <-- ADDED: Get current user ID

  // Data States
  const [submittedItem, setSubmittedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // We store the fetched matches here temporarily while the animation runs
  const [fetchedMatches, setFetchedMatches] = useState([])

  // Matching Animation States
  const [matchingPhase, setMatchingPhase] = useState("analyzing")
  const [progress, setProgress] = useState(0)
  const [matchedItems, setMatchedItems] = useState([])

  // 1. Fetch the report AND the matches from the AI Backend
  useEffect(() => {
    const fetchMatches = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetching from your new matching endpoint
        const response = await axios.get(`${serverUrl}/api/matching/findmatches/${id}`, {
          withCredentials: true
        });

        setSubmittedItem(response.data.sourceItem);
        
        // Grab only the top 2 matches to keep the UI clean
        setFetchedMatches(response.data.matches.slice(0, 2));

      } catch (err) {
        console.error("Failed to fetch report details:", err);
        setError("Could not load the report details or run the matching engine.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [id, serverUrl]);

  // 2. The "AI Processing" Animation
  useEffect(() => {
    if (!submittedItem) return;

    const runSimulatedMatching = async () => {
      setMatchingPhase("analyzing")
      for (let i = 0; i <= 30; i += 5) {
        await new Promise(r => setTimeout(r, 80))
        setProgress(i)
      }

      setMatchingPhase("searching")
      for (let i = 30; i <= 70; i += 5) {
        await new Promise(r => setTimeout(r, 80))
        setProgress(i)
      }

      for (let i = 70; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 60))
        setProgress(i)
      }

      setMatchedItems(fetchedMatches) 
      setMatchingPhase("complete")
    }

    runSimulatedMatching()
  }, [submittedItem, fetchedMatches])

  const getPhaseMessage = () => {
    switch (matchingPhase) {
      case "analyzing": return "Analyzing item vectors & tags..."
      case "searching": return "Comparing against database..."
      case "complete": return matchedItems.length > 0 ? "Potential matches found!" : "Search complete"
      default: return "Processing..."
    }
  }

  // --- UI RENDERING ---

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Booting up matching engine...</p>
        </div>
      </>
    )
  }

  if (error || !submittedItem) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-red-200 rounded-xl shadow-sm text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Item not found."}</p>
          <button 
            onClick={() => navigate('/report')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Go back to reporting
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/report')}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Results</h1>
            <p className="text-gray-500">
              Reviewing matches for your {submittedItem.reportType} item
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Your Reported Item */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Your Report</h2>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {submittedItem.image ? (
                <img
                  src={submittedItem.image}
                  alt={submittedItem.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image provided</span>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {submittedItem.title}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold shrink-0 ml-2 ${
                    submittedItem.reportType === "lost" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {submittedItem.reportType}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  {submittedItem.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-900">{submittedItem.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-900 text-right">{submittedItem.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(submittedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {submittedItem.author && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0">
                      {submittedItem.author.profileImage ? (
                        <img 
                          src={submittedItem.author.profileImage} 
                          alt={submittedItem.author.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Reported By</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {submittedItem.author.name}
                      </p>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Matching Progress & Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Progress Bar Container */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
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
                
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            {matchingPhase === "complete" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {matchedItems.length > 0 ? (
                  <>
                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-bold text-yellow-900">
                          Top {matchedItems.length} AI Match{matchedItems.length > 1 ? "es" : ""} Found!
                        </h3>
                      </div>
                      <p className="text-sm text-yellow-800">
                        Our AI has analyzed descriptions and images to find these potential matches. 
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {matchedItems.map((item) => (
                        <div key={item._id} className="relative group flex flex-col">
                          
                          {/* AI Match Percentage Badge */}
                          <div className="absolute -top-3 -right-3 z-10 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
                            {item.matchScore}% Match
                          </div>

                          <ItemCard 
                            item={{...item, potentialMatch: true}} 
                            onClick={() => {
                              if (typeof onViewItem === 'function') onViewItem(item);
                            }} 
                          />
                          
                          {/* Contact Overlay on Hover */}
                          {/* FIX: Re-added Safe Navigation Logic to Chat Page */}
                          <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button 
                              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (typeof onContactUser === 'function') {
                                  onContactUser(item);
                                } else {
                                  // Fallback: Directly navigate to messages if prop is missing
                                  navigate("/messages", {
                                    state: {
                                      itemId: item._id,
                                      reporterId: item.author?._id || item.author,
                                      viewerId: userData?._id,
                                      itemDetails: item
                                    }
                                  });
                                }
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                              Contact Reporter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <XCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No Matches Found Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4 text-sm">
                      We couldn't find any matching items right now. Your item has been securely added to the system, and we'll notify you if someone reports a match.
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {/* FIX: Added explicit cursor-pointer */}
                  <button 
                    onClick={() => navigate('/report')}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Report Another
                  </button>
                  
                  {/* FIX: Added Safe Navigation Fallback + cursor-pointer */}
                  <button 
                    onClick={() => {
                      if (typeof onBrowse === 'function') {
                        onBrowse();
                      } else {
                        navigate('/search');
                      }
                    }}
                    className="flex-1 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    Browse All Items
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}