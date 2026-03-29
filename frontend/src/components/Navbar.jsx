import React, { useState, useRef, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Search, MessageSquare, Bell, Menu, X, Home, List, PlusCircle } from "lucide-react"
import axios  from "axios" // Ensure this matches your setup, usually it's just `import axios from "axios"`
import { authDataContext } from '../context/AuthContext.jsx'
import { userDataContext } from "../context/UserContext.jsx"

export function Navbar({ onSearch }) {
  let { userData, setUserData } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Search Items", icon: List },
    { path: "/report", label: "Report Item", icon: PlusCircle },
  ]

  const handleLogOut = async () => {
    try {
      // Call backend logout
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      
      // Clear any storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Navigate with replace to prevent back button
      navigate("/login", { replace: true })
    } catch (error) {
      console.log("Logout error:", error)
      localStorage.clear()
      sessionStorage.clear()
      navigate("/login", { replace: true })
    }
  }

  return (
    <header className="sticky top-0 mb-2 -mt-4 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <Search className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">MatchFound</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/browse' && currentPath.includes('/browse'))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search lost or found items..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          
          {/* Messages */}
          <Link
            to="/messages"
            className={`relative p-2 rounded-md transition-colors ${
              currentPath === "/messages" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white">
              3
            </span>
            <span className="sr-only">Messages</span>
          </Link>

          {/* Notifications */}
          <button className="relative hidden sm:flex p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white" />
            <span className="sr-only">Notifications</span>
          </button>

          {/* User Menu (Custom Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {/* UI Avatar Replacement Here */}
              <div className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                <img 
                  src={`https://ui-avatars.com/api/?name=${userData?.name || 'U'}&background=2563eb&color=fff`} 
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false); 
                  }}
                >
                  Profile
                </button>
              
                <div className="h-px bg-gray-200 my-1"></div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" 
                  onClick={handleLogOut}
                >
                  Log out
                </button>
              </div> 
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4 shadow-inner">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path === '/browse' && currentPath.includes('/browse'))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}