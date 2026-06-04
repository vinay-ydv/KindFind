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
 
const AppContent = () => {
  const navigate = useNavigate();
 
  const { userData, isLoading } = useContext(userDataContext);


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/search"); 
  };

  const handleViewMatch = () => {
    setIsDetailOpen(false);
    navigate("/search");
  };

  const handleContactUser = () => {
    setIsDetailOpen(false);
    navigate("/messages");
  };

 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
 
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
         
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

         
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

         
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

     
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


const App = () => {
  return (
    <AppContent />
  );
};

export default App;