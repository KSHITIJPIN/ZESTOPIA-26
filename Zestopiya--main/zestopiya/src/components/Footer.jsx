import React from 'react';
import { Instagram, Globe, Linkedin, Facebook, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">

                {/* About Section */}
                <div className="footer-section brand-section">
                    <h3>ZESTOPIA</h3>
                    <p className="tagline">The ultimate college gathering celebrating innovation, culture, and unity.</p>
                    <div className="social-links">
                        <a href="https://www.instagram.com/zestopia_soet/" target="_blank" rel="noopener noreferrer" className="social-icon"><Instagram size={20} /></a>
                        <a href="https://soet.mgmu.ac.in" target="_blank" rel="noopener noreferrer" className="social-icon"><Globe size={20} /></a>
                        <a href="https://www.linkedin.com/company/mgmu-school-of-engineering-and-technology/posts/" target="_blank" rel="noopener noreferrer" className="social-icon"><Linkedin size={20} /></a>
                        <a href="https://www.facebook.com/mgmu.soet?mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" className="social-icon"><Facebook size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section links-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/register">Register - Participant</Link></li>
                        <li><Link to="/register?type=organizer">Join Team</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section contact-section">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <a href="mailto:richa24bagdiya@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
                            <Mail size={16} /> <span>richa24bagdiya@gmail.com</span>
                        </a>
                    </div>
                    <div className="contact-item">
                        <a href="mailto:diyachuphal19@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
                            <Mail size={16} /> <span>diyachuphal19@gmail.com</span>
                        </a>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} /> <span>+91 9028616517 Richa Bagdiya</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} /> <span>+91 7276664757 Diya Chuphal</span>
                    </div>
                    <div className="contact-item">
                        <a href="https://www.google.com/maps/place/MGMU+School+of+Engineering+and+Technology/@19.8806109,75.3561641,17z/data=!3m1!4b1!4m6!3m5!1s0x3bdba375c8d16529:0xb421d7cfa8aa0808!8m2!3d19.8806109!4d75.3561641!16s%2Fg%2F11t7fgpxjq?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
                            <MapPin size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
                            <span>School of Engineering and Technology MGMU, N-6, Cidco, Chhatrapati Sambhajinagar, Maharashtra 431003</span>
                        </a>
                    </div>
                </div>

            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Zestopia. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
