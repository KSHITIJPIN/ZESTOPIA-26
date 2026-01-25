import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'lucide-react'; // Placeholder until layout component is built

import Home from './pages/Home';
import Events from './pages/Events';
import Register from './pages/Register';

import EventDetails from './pages/EventDetails';
import Admin from './pages/Admin';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundEffect from './components/BackgroundEffect';

function App() {
  return (
    <Router>
      <div className="bg-animated" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <BackgroundEffect />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Navbar />
          <div style={{ paddingTop: '80px', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/organizer-register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
