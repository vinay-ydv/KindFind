import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// Import your components
import { Navbar } from './components/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { Report } from './pages/Report.jsx';
import { Chat } from './pages/Chat.jsx';
import { ItemDetail } from './components/ItemDetail.jsx';
import { Search } from './pages/Search.jsx';
import { Matching } from './pages/Matching.jsx';
import { Profile } from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { Notification } from './pages/Notification.jsx';
import { VideoCall } from './pages/VideoCall.jsx';
import { userDataContext } from './context/UserContext.jsx';
 // Assuming you have a Dashboard

// Import your UserContext
 // Adjust path if needed

// 1. Inner component where we can safely use useNavigate and manage state
const AppContent = () => {
  const navigate = useNavigate();
  
  // 1. Grab userData AND isLoading from your context
  const { userData, isLoading } = useContext(userDataContext);

  // Global UI states for the search and the item detail modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/search"); // Automatically go to browse page when searching
  };

  const handleViewMatch = () => {
    setIsDetailOpen(false);
    navigate("/search");
  };

  const handleContactUser = () => {
    setIsDetailOpen(false);
    navigate("/messages");
  };

  // 2. The Loading Guard! 
  // If context is still fetching the user, show this screen instead of the routes.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          {/* A simple CSS spinner - replace with your own spinner if you have one */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Assuming Navbar is rendered somewhere here or inside AppContent */}
      {/* <Navbar onSearch={handleSearch} /> */}
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* PROTECTED ROUTES */}
          <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
          
          
          <Route 
            path="/search" 
            element={userData ? <Search onItemClick={handleItemClick} searchQuery={searchQuery} /> : <Navigate to="/login" />} 
          />
          <Route path="/report" element={userData ? <Report /> : <Navigate to="/login" />} />
          <Route path="/messages" element={userData ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/matching/:id" element={userData ? <Matching onViewItem={handleItemClick} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={userData ? <Notification onViewItem={handleItemClick} /> : <Navigate to="/login" />} />
          <Route path="/video-call/:roomId" element={userData ? <VideoCall /> : <Navigate to="/login" />} />

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Fallback route - sends users home if they type a bad URL */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Modal that can sit on top of any page */}
      <ItemDetail
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onViewMatch={handleViewMatch}
        onContactUser={handleContactUser}
      />
    </div>
  );
};

// 2. Your main App wrapper
const App = () => {
  return (
    <AppContent />
  );
};

export default App;