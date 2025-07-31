import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Consultation } from './pages/Consultation';
import { Inquiry } from './pages/Inquiry';
import { Reviews } from './pages/Reviews';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 