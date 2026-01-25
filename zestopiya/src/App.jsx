import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundEffect from './components/BackgroundEffect';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for mobile performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Register = lazy(() => import('./pages/Register'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Router>
      <div className="bg-animated" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <BackgroundEffect />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Navbar />
          <div style={{ paddingTop: '80px', flex: 1 }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/register" element={<Register />} />
                <Route path="/organizer-register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
