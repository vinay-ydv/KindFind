import React, { useState } from "react"
import { Sparkles, MapPin, Calendar, Check, Loader2, ImagePlus } from "lucide-react"

const categories = [
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

export function Report() {
  const [reportType, setReportType] = useState("lost")
  const [date, setDate] = useState("") // Changed to empty string for native HTML date input
  const [ocrStatus, setOcrStatus] = useState("idle") // idle, loading, success
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  })

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
    }
  }

  const handleOCR = async () => {
    setOcrStatus("loading")
    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFormData((prev) => ({
      ...prev,
      description: "Brown leather wallet, appears to be Coach brand. Contains visible credit cards and some cash. Found near a bus stop bench.",
    }))
    setOcrStatus("success")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log({ reportType, date, formData, uploadedImage })
    alert("Report submitted successfully!")
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Report an Item</h2>
          <p className="text-gray-500 mt-1">
            Help reunite lost items with their owners by submitting a detailed report.
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Report Type Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">What would you like to report?</label>
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setReportType("lost")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    reportType === "lost"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setReportType("found")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    reportType === "found"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  I Found Something
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                } ${uploadedImage ? "p-2" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white/90 text-gray-700 hover:bg-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors"
                      onClick={() => {
                        setUploadedImage(null)
                        setOcrStatus("idle")
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-blue-100">
                        <ImagePlus className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Drag and drop an image here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to browse from your device
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* OCR Button */}
              {uploadedImage && (
                <button
                  type="button"
                  onClick={handleOCR}
                  disabled={ocrStatus === "loading"}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {ocrStatus === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing image...
                    </>
                  ) : ocrStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Description extracted successfully
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Auto-fill description from image (OCR)
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Item Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Item Title</label>
              <input
                id="title"
                type="text"
                placeholder='e.g., "Brown Leather Wallet" or "Golden Retriever"'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
              <textarea
                id="description"
                placeholder="Provide as much detail as possible - color, brand, distinguishing features, contents..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
              />
            </div>

            {/* Category & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow for native select */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date {reportType === "lost" ? "Lost" : "Found"}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="location"
                  type="text"
                  placeholder="Where was the item lost/found?"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-4"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}