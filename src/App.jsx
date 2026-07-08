import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import { CrtProvider } from './components/CrtContext';

const App = () => {
  return (
    <CrtProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </CrtProvider>
  );
};

export default App;