import React, { useState, useEffect, useContext } from "react"
import { FilterBar } from "../components/FilterBar.jsx"
import { ItemCard } from "../components/ItemCard.jsx"
import { Navbar } from "../components/Navbar.jsx"
import axios from "axios"
import { authDataContext } from "../context/AuthContext.jsx"
import { Loader2 } from "lucide-react" // For the loading spinner

export function Search({ onItemClick, searchQuery }) {
  const { serverUrl } = useContext(authDataContext)
  
  // New States for Real Data
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState({
    status: "all",
    category: "",
    location: "",
    dateRange: { from: "", to: "" }, 
  })

  // Fetch all reports when the component loads
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${serverUrl}/api/report/all`, {
          withCredentials: true
        })
        setItems(response.data.reports)
      } catch (error) {
        console.error("Failed to fetch all reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllItems()
  }, [serverUrl])

  // Filter the real data
  const filteredItems = items.filter((item) => {
    // Using item.reportType because that's what we called it in the Mongoose Schema
    if (filters.status !== "all" && item.reportType !== filters.status) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Count using reportType
  const lostCount = items.filter((i) => i.reportType === "lost").length
  const foundCount = items.filter((i) => i.reportType === "found").length

  return (
    <div>
      <Navbar />
      
      {/* Stats Bar */}
      <div className="flex gap-4 mb-6 mt-4 px-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm" />
          <span className="text-gray-600 font-medium">{lostCount} Lost Items</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm" />
          <span className="text-gray-600 font-medium">{foundCount} Found Items</span>
        </div>
      </div>

      {/* Filter Bar Component */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4 px-5">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> items
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading items...</p>
        </div>
      ) : (
        <>
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {filteredItems.map((item) => (
              // Use item._id instead of item.id because MongoDB uses _id
              <ItemCard key={item._id} item={item} onClick={() => onItemClick(item)} />
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center mx-4 py-16 bg-white border border-gray-200 rounded-xl mt-4">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No items found matching your filters.</p>
              <button 
                onClick={() => setFilters({ status: "all", category: "", location: "", dateRange: { from: "", to: "" }})}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}