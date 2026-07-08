import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import TerminalWindow from './components/TerminalWindow';

const App = () => {
  return (
    <Router>
      <TerminalWindow>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </TerminalWindow>
    </Router>
  );
};

export default App;