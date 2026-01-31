import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <Rocket size={28} color="rgb(var(--primary))" />
                    <span className="logo-text">ZESTOPIA</span>
                </Link>

                {/* Desktop Links */}
                <div className="nav-links desktop-only">
                    <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
                    <Link to="/events" className={`nav-link ${isActive('/events')}`} onClick={closeMenu}>Events</Link>
                    <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register Now</Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <Link to="/" className={`mobile-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
                <Link to="/events" className={`mobile-link ${isActive('/events')}`} onClick={closeMenu}>Events</Link>
                <Link to="/organizer-register" className={`mobile-link ${isActive('/organizer-register')}`} onClick={closeMenu}>Join Team</Link>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/register" className="btn btn-primary" onClick={closeMenu} style={{ width: '100%', display: 'block', textAlign: 'center' }}>Register Now</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
