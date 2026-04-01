import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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

// Import your components (adjust paths as needed to match your folders)


// 1. Inner component where we can safely use useNavigate and manage state
const AppContent = () => {
  const navigate = useNavigate();

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


      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Your main routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={
              <Search
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
              />
            }
          />
          <Route path="/report" element={<Report />} />
          <Route path="/messages" element={<Chat />} />
          {/* <Route path="/matching/:id" element={<Matching/>}/> */}
          \// Inside App.jsx routes:
          <Route path="/matching/:id" element={<Matching onViewItem={handleItemClick} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notifications" element={<Notification onViewItem={handleItemClick} />}
          /><Route path="/video-call/:roomId" element={<VideoCall />} />
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