import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, LogOut, MapPin, Calendar, CheckCircle2, Search, Trash2, Edit, Loader2, X, ImagePlus, Sparkles } from "lucide-react"
import axios from "axios"
import { Navbar } from "../components/Navbar.jsx"
import { userDataContext } from "../context/UserContext.jsx"
import { authDataContext } from "../context/AuthContext.jsx"

// Needed for the edit form dropdown
const categories = [
  "Electronics", "Pets", "Wallets", "Keys",
  "Jewelry", "Documents", "Bags", "Clothing", "Other",
]

export function Profile() {
  const navigate = useNavigate()
  const { userData, setUserData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)

  const [myReports, setMyReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // --- EDIT MODAL STATES ---
  const [editingReport, setEditingReport] = useState(null) // Holds the report being edited
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)

  // Fetch real reports on component mount
  useEffect(() => {
    const fetchMyReports = async () => {
      if (!userData) return;
      try {
        const response = await axios.get(`${serverUrl}/api/report/my-reports`, { 
          withCredentials: true 
        });
        setMyReports(response.data.reports);
      } catch (error) {
        console.error("Failed to fetch my reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReports();
  }, [userData, serverUrl])

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report? This cannot be undone.")) return

    try {
      await axios.delete(`${serverUrl}/api/report/delete/${reportId}`, { 
        withCredentials: true 
      })
      setMyReports((prev) => prev.filter((item) => item._id !== reportId))
    } catch (error) {
      console.error("Error deleting report:", error)
      alert("Failed to delete report")
    }
  }

  // --- EDIT REPORT HANDLERS ---
  const openEditModal = (report) => {
    setEditingReport(report)
    // Pre-fill the form with existing data
    setEditFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
      reportType: report.reportType,
      // Format date for the input field (YYYY-MM-DD)
      date: new Date(report.date).toISOString().split('T')[0], 
    })
    setEditImagePreview(report.image)
    setEditImageFile(null)
  }

  const handleEditFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditImageFile(file)
      setEditImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const submitData = new FormData()
      submitData.append("title", editFormData.title)
      submitData.append("description", editFormData.description)
      submitData.append("category", editFormData.category)
      submitData.append("location", editFormData.location)
      submitData.append("reportType", editFormData.reportType)
      submitData.append("date", editFormData.date)
      
      // Only append a new image if the user selected one
      if (editImageFile) {
        submitData.append("image", editImageFile)
      }

      const response = await axios.put(`${serverUrl}/api/report/update/${editingReport._id}`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })

      // Update the report in our local state so the UI reflects the changes instantly
      setMyReports((prev) => 
        prev.map((item) => item._id === editingReport._id ? response.data.report : item)
      )
      
      // Close the modal
      setEditingReport(null)

    } catch (error) {
      console.error("Error updating report:", error)
      alert("Failed to update report")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      localStorage.clear()
      setUserData(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
      navigate("/login")
    }
  }

  if (!userData || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        
        {/* Centered Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.name}&background=2563eb&color=fff&size=128`} 
              alt={userData.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">
              {userData.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2 text-slate-500 font-medium">
              <Mail className="h-4 w-4" />
              <span>{userData.email}</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">{myReports.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Reports</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-red-500">
              {myReports.filter(r => r.reportType === 'lost').length}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Items Lost</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">
              {myReports.filter(r => r.reportType === 'found').length}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Items Found</p>
          </div>
        </div>

        {/* My Reported Items Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">
            My Reported Items
          </h2>
          
          {myReports.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">You haven't reported any items yet.</p>
              <button 
                onClick={() => navigate("/report")}
                className="mt-4 text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Report your first item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((item) => (
                <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-4 hover:shadow-md transition-all group">
                  {/* Thumbnail */}
                  <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    <span className={`absolute bottom-0 left-0 right-0 text-center text-[9px] font-black py-0.5 text-white uppercase tracking-tighter ${
                      item.reportType === "lost" ? "bg-red-500" : "bg-green-600"
                    }`}>
                      {item.reportType}
                    </span>
                  </div>

                 

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                    <div className="relative">
                      
                      {/* Action Buttons Container */}
                      <div className="absolute -top-1 -right-1 flex gap-1">
                        
                        {/* NEW: Find Match Button */}
                        <button 
                          onClick={() => navigate(`/matching/${item._id}`)}
                          className="flex items-center gap-1 p-1.5 px-2.5 text-xs font-bold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors mr-1"
                          title="Find Matches"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Find Match</span>
                        </button>

                        {/* Edit Button */}
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Report"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteReport(item._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Adjusted pr-28 to ensure the long title doesn't overlap the new button */}
                      <h3 className="font-bold text-slate-900 pr-[120px] truncate">{item.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      
                      {item.matchStatus === "resolved" && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" title="Resolved" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="pt-8 flex justify-center">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 cursor-pointer text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* --- EDIT REPORT MODAL --- */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Edit Report</h2>
              <button 
                onClick={() => setEditingReport(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              
              {/* Type & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Report Type</label>
                  <select
                    value={editFormData.reportType}
                    onChange={(e) => setEditFormData({ ...editFormData, reportType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Location & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Update Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {editImagePreview && (
                    <div className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={editImagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ImagePlus className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Click to upload new image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isUpdating ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}