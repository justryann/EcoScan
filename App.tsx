
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FloatingChatbot from './components/FloatingChatbot';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Result from './pages/Result';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/result/:barcode" element={<Result />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
      <Onboarding />
      <FloatingChatbot />
    </Router>
  );
}

export default App;
