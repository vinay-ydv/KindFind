import React, { useState, useRef, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { MessageSquare, Bell, Menu, X, Home, List, PlusCircle } from "lucide-react" 
import axios  from "axios"
import io from "socket.io-client" 
import { authDataContext } from '../context/AuthContext.jsx'
import { userDataContext } from "../context/UserContext.jsx"

import logo from "../assets/logo.png"

export function Navbar() { 
  let { userData, setUserData } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0) 
  const [unreadNotifs, setUnreadNotifs] = useState(0) // <-- New State for Notifications Badge
  
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  // ==========================================
  // FETCH UNREAD COUNTS & LISTEN TO SOCKET
  // ==========================================
  useEffect(() => {
    if (!userData?._id || !serverUrl) return;

    // 1. Function to calculate total unread chat messages
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chat/conversations`, { withCredentials: true });
        const total = res.data.conversations.reduce((sum, chat) => {
          if (chat.lastMessageSender !== userData._id) {
            return sum + (chat.unreadCount || 0);
          }
          return sum;
        }, 0);
        setUnreadCount(total);
      } catch (error) {
        console.error("Failed to fetch unread chat count", error);
      }
    };

    // 2. Function to calculate total unread match notifications
    const fetchUnreadNotifs = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/notifications`, { withCredentials: true });
        // Filter the array to count only the ones where isRead is false
        const unread = res.data.notifications.filter(n => !n.isRead).length;
        setUnreadNotifs(unread);
      } catch (error) {
        console.error("Failed to fetch unread notifications", error);
      }
    };

    // Initial Fetch
    fetchUnreadCount(); 
    fetchUnreadNotifs();

    // 3. Socket Connection
    const socket = io(serverUrl);
    socket.on("connect", () => {
      socket.emit("register_user", userData._id);
    });

    // Listen for new chat messages
    socket.on("update_sidebar", () => {
      fetchUnreadCount(); 
    });

    // Listen for new match notifications (Make sure the event name matches your backend!)
    socket.on(`new_notification_${userData._id}`, () => {
      fetchUnreadNotifs();
    });

    return () => socket.close();
  }, [userData, serverUrl, currentPath]); 

  // ==========================================
  // OTHER HANDLERS
  // ==========================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      localStorage.clear()
      sessionStorage.clear()
      navigate("/login", { replace: true })
    } catch (error) {
      console.log("Logout error:", error)
      localStorage.clear()
      sessionStorage.clear()
      navigate("/login", { replace: true })
    }
  }

  // First 3 standard nav items
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Search", icon: List }, 
    { path: "/report", label: "Report", icon: PlusCircle },
  ]

  return (
    <header className="sticky top-0 mb-2 -mt-4 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT: LOGO */}
        <div className="w-1/4 flex justify-start">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img 
              src={logo} 
              alt="KindFind Logo" 
              className="h-10 w-auto object-contain" 
            />
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-sm font-black leading-none text-blue-600">
                Kind
              </span>
              <span className="text-[13px] font-bold leading-none tracking-[0.15em] text-gray-500 uppercase mt-0.5">
                Find
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: ALL 5 NAVIGATION LINKS */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-3">
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

          {/* Messages Link */}
          <Link
            to="/messages"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPath === "/messages" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {/* ICON WITH TOP-RIGHT BADGE */}
            <div className="relative flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            Messages
          </Link>

          {/* Notifications Link */}
          <Link
            to="/notifications"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPath === "/notifications" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {/* ICON WITH TOP-RIGHT BADGE */}
            <div className="relative flex items-center justify-center">
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-2 -right-2.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadNotifs > 9 ? "9+" : unreadNotifs}
                </span>
              )}
            </div>
            Notifications
          </Link>
        </nav>

        {/* RIGHT: USER PROFILE & MOBILE MENU TOGGLE */}
        <div className="w-1/4 flex items-center justify-end gap-2">
          
          {/* User Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full flex items-center cursor-pointer justify-center border border-gray-200 overflow-hidden shadow-sm">
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
                  className="w-full text-left px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false); 
                  }}
                >
                  Profile
                </button>
              
                <div className="h-px bg-gray-200 my-1"></div>
                <button 
                  className="w-full text-left px-4 cursor-pointer py-2 text-sm text-red-600 hover:bg-red-50" 
                  onClick={handleLogOut}
                >
                  Log out
                </button>
              </div> 
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN (Shown only on small screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-4 shadow-inner">
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
            
            {/* Mobile Messages */}
            <Link
              to="/messages"
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentPath === "/messages" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative flex items-center justify-center mr-3">
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              Messages
            </Link>

            {/* Mobile Notifications */}
            <Link 
              to="/notifications"
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left ${
                currentPath === "/notifications" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative flex items-center justify-center mr-3">
                <Bell className="h-5 w-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white shadow-sm">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </div>
              Notifications
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}