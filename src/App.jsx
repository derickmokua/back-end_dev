import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const ChatPage = lazy(() => import('./pages/ChatPage'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-terminal-green font-mono">
          <span>&gt; initializing_secure_ops_tunnel...</span>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;