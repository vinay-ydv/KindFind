import React, { useState } from "react"
import { FilterBar } from "./FilterBar.jsx"
import { ItemCard } from "./ItemCard.jsx"


const mockItems = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - Space Black",
    category: "Electronics",
    status: "lost",
    location: "Central Park, NYC",
    date: "Mar 24, 2026",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    description: "Lost my iPhone 15 Pro Max near the Bethesda Fountain area. Has a black leather case with my initials JD.",
    potentialMatch: false,
  },
  {
    id: 2,
    title: "Golden Retriever - Answers to Max",
    category: "Pets",
    status: "lost",
    location: "Riverside Drive, Chicago",
    date: "Mar 23, 2026",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    description: "Our beloved golden retriever Max went missing during our evening walk. He is 3 years old, very friendly, wearing a blue collar with tags.",
    potentialMatch: true,
  },
  {
    id: 3,
    title: "Leather Wallet - Brown",
    category: "Wallets",
    status: "found",
    location: "Times Square Station, NYC",
    date: "Mar 23, 2026",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
    description: "Found a brown leather wallet near the ticket machines at Times Square subway station. Contains ID and some cards.",
    potentialMatch: false,
  },
  {
    id: 4,
    title: "Car Keys - Toyota with Red Keychain",
    category: "Keys",
    status: "found",
    location: "Mall of America, MN",
    date: "Mar 22, 2026",
    image: "https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=400&h=300&fit=crop",
    description: "Found Toyota car keys with a distinctive red keychain near the food court. Please describe the keychain to claim.",
    potentialMatch: false,
  },
  {
    id: 5,
    title: "MacBook Pro 14-inch",
    category: "Electronics",
    status: "lost",
    location: "Starbucks, Market St, SF",
    date: "Mar 21, 2026",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    description: "Left my MacBook Pro at Starbucks on Market Street. Silver, 14-inch, has several stickers on the back including a Python logo.",
    potentialMatch: false,
  },
  {
    id: 6,
    title: "Diamond Engagement Ring",
    category: "Jewelry",
    status: "lost",
    location: "Venice Beach, LA",
    date: "Mar 20, 2026",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
    description: "Lost a platinum engagement ring with a 1.5 carat diamond. Incredible sentimental value. Reward offered.",
    potentialMatch: false,
  },
  {
    id: 7,
    title: "Backpack - North Face Black",
    category: "Bags",
    status: "found",
    location: "Union Station, LA",
    date: "Mar 20, 2026",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    description: "Found a black North Face backpack on platform 3. Contains some books and a laptop charger.",
    potentialMatch: false,
  },
  {
    id: 8,
    title: "Passport - US",
    category: "Documents",
    status: "found",
    location: "JFK Airport, Terminal 4",
    date: "Mar 19, 2026",
    image: "https://images.unsplash.com/photo-1544965838-54ef8406f3e8?w=400&h=300&fit=crop",
    description: "Found a US passport near the check-in counters in Terminal 4. Turned in to airport security but posting for visibility.",
    potentialMatch: false,
  },
]

export function Browse({ onItemClick, searchQuery }) {
  const [filters, setFilters] = useState({
    status: "all",
    category: "",
    location: "",
    dateRange: { from: "", to: "" }, // Initialized with empty strings for native HTML date inputs
  })

  const filteredItems = mockItems.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const lostCount = mockItems.filter((i) => i.status === "lost").length
  const foundCount = mockItems.filter((i) => i.status === "found").length

  return (
    <div>
      {/* Stats Bar */}
      <div className="flex gap-4 mb-6">
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
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> items
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl mt-4">
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
    </div>
  )
}