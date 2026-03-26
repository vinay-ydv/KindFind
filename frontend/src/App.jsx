import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Navbar } from './components/Navbar.jsx';
import { Home } from './components/Home.jsx';
import { Report } from './components/Report.jsx';
import { Chat } from './components/Chat.jsx';
import { ItemDetail } from './components/ItemDetail.jsx';
import { Browse } from './components/Browse.jsx';

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
    navigate("/browse"); // Automatically go to browse page when searching
  };

  const handleViewMatch = () => {
    setIsDetailOpen(false);
    navigate("/browse");
  };

  const handleContactUser = () => {
    setIsDetailOpen(false);
    navigate("/messages");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Your main routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/browse" 
            element={
              <Browse
                onItemClick={handleItemClick} 
                searchQuery={searchQuery} 
              />
            } 
          />
          <Route path="/report" element={<Report />} />
          <Route path="/messages" element={<Chat />} />
          
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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;