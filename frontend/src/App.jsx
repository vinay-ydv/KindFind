import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
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
import { Dashboard } from './pages/Dashboard.jsx'; // Don't forget to import Dashboard!

// Import your UserContext
import { userDataContext } from './UserContext.jsx'; // Adjust this path if it's in a different folder


// 1. Inner component where we can safely use useNavigate and manage state
const AppContent = () => {
  const navigate = useNavigate();
  
  // Get userData from Context
  const { userData } = useContext(userDataContext);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Assuming Navbar is rendered somewhere here */}
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* PROTECTED ROUTES
            If userData exists, render the component. 
            If not, use <Navigate to="/login" /> to redirect them. 
          */}
          <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={userData ? <Dashboard /> : <Navigate to="/login" />} />
          
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

          {/* PUBLIC / AUTH ROUTES
            These do not check for userData so unauthenticated users can access them.
          */}
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