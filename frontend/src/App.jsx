import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/user_forms/Login';
import Dashboard from './components/Dashboard';
import DevicePage from './pages/DevicePage';
import Navbar from './components/Navbar';
import ChatPage from './components/chatbot/ChatPage';

import AdvancedDashboard from './pages/AdvancedDashboard';
import Upload from "./pages/UploadPage";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <Navbar onLogout={() => setIsLoggedIn(false)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/charts" element={<AdvancedDashboard />} />
        <Route path='/upload-firmware' element={<Upload />} />

      </Routes>
    </Router>
  );
}

export default App;