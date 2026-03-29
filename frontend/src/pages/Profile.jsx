import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, LogOut, MapPin, Calendar, CheckCircle2, Search, Trash2, Loader2 } from "lucide-react"
import axios from "axios"
import { Navbar } from "../components/Navbar.jsx"
import { userDataContext } from "../context/UserContext.jsx"
import { authDataContext } from "../context/AuthContext.jsx"

export function Profile() {
  const navigate = useNavigate()
  const { userData, setUserData, reportData, setReportData, getReport } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)

  // Fetch real reports on component mount
  // useEffect(() => {
  //   if (userData) {
  //     getReport()
  //   }
  // }, [userData])

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return

    try {
      await axios.delete(`${serverUrl}/api/post/delete/${reportId}`, { withCredentials: true })
      // Update local state to remove the item immediately
      setReportData((prev) => prev.filter((item) => item._id !== reportId))
    } catch (error) {
      console.error("Error deleting report:", error)
      alert("Failed to delete report")
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

  if (!userData) {
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
              src={`https://ui-avatars.com/api/?name=${userData.name} &background=2563eb&color=fff&size=128`} 
              alt={userData.firstName} 
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
            <p className="text-3xl font-bold text-blue-600">{reportData?.length || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Reports</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-red-500">
              {reportData?.filter(r => r.reportType === 'lost').length || 0}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Items Lost</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">
              {reportData?.filter(r => r.reportType === 'found').length || 0}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Items Found</p>
          </div>
        </div>

        {/* My Reported Items Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">
            My Reported Items
          </h2>
          
          {reportData?.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">You haven't reported any items yet.</p>
              <button 
                onClick={() => navigate("/report")}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Report your first item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.map((item) => (
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
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteReport(item._id)}
                        className="absolute -top-1 -right-1 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <h3 className="font-bold text-slate-900 pr-6 truncate">{item.title}</h3>
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
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

      </div>
    </>
  )
}