import React, { useState } from "react"
import { Filter, MapPin, Tag, RotateCcw } from "lucide-react"

const categories = [
  "All Categories",
  "Electronics",
  "Pets",
  "Wallets",
  "Keys",
  "Jewelry",
  "Documents",
  "Bags",
  "Clothing",
  "Other",
]

export function FilterBar({ filters, onFilterChange }) {
  // Using strings 'YYYY-MM-DD' for native HTML date inputs
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status })
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    onFilterChange({ ...filters, category: category === "All Categories" ? "" : category })
  }

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value })
  }

  const handleDateChange = (type, value) => {
    const newRange = { ...dateRange, [type]: value }
    setDateRange(newRange)
    onFilterChange({ ...filters, dateRange: newRange })
  }

  const handleReset = () => {
    setDateRange({ from: "", to: "" })
    onFilterChange({
      status: "all",
      category: "",
      location: "",
      dateRange: { from: "", to: "" },
    })
  }

  const activeFiltersCount = [
    filters?.status && filters.status !== "all",
    filters?.category,
    filters?.location,
    dateRange.from,
    dateRange.to
  ].filter(Boolean).length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Filter Header & Badge */}
        <div className="flex items-center gap-2 text-gray-500">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-gray-100 text-gray-700 h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {/* Status Toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          {["all", "lost", "found"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                filters?.status === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Location Input */}
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={filters?.location || ""}
            onChange={handleLocationChange}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Category Select */}
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={filters?.category || "All Categories"}
            onChange={handleCategoryChange}
            className="w-[160px] pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow to replace native one */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Date Range Picker (Native HTML) */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-sm text-gray-500">From</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
          />
          <span className="text-sm text-gray-500 border-l pl-2 border-gray-300">To</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}