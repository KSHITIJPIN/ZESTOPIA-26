import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Mail, Phone } from 'lucide-react';
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
                        <a href="#" className="social-icon"><Instagram size={20} /></a>
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                        <a href="#" className="social-icon"><Linkedin size={20} /></a>
                        <a href="#" className="social-icon"><Facebook size={20} /></a>
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
                        <Mail size={16} /> <span>richa24bagdiya@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={16} /> <span>diyachuphal19@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} /> <span>+91 9028616517 (Richa)</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} /> <span>+91 7276664757 (Diya)</span>
                    </div>
                    <div className="contact-item">
                        <MapPin size={16} /> <span>School of Engineering and Technology MGMU, N-6, Cidco, Chhatrapati Sambhajinagar, Maharashtra 431003</span>
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
