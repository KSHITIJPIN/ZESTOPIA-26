import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Info, FileText, Phone } from 'lucide-react';
import { eventsData } from '../data/events';
import './EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const event = eventsData.find(e => e.id === parseInt(id));
    const [activeTab, setActiveTab] = useState('info');

    if (!event) {
        return <Navigate to="/events" replace />;
    }

    return (
        <div className="event-details-page">
            {/* Hero Header */}
            <div className="event-hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,14, 1)), url(${event.image})` }}>
                <div className="container event-hero-content">
                    <Link to="/events" className="back-link"><ArrowLeft size={20} /> Back to Events</Link>
                    <span className="category-badge">{event.category}</span>
                    <h1>{event.title}</h1>
                    <div className="event-meta">
                        <div className="meta-item"><Calendar size={20} /> {event.date}</div>
                        <div className="meta-item"><Clock size={20} /> {event.time}</div>
                        <div className="meta-item"><MapPin size={20} /> {event.location}</div>
                    </div>
                </div>
            </div>

            <div className="container section-padding event-body">
                <div className="details-grid">

                    {/* Main Content Area */}
                    <div className="details-main glass-panel">
                        {/* Simplified Tabs */}
                        <div className="details-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                <Info size={20} /> Overview
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rules')}
                            >
                                <FileText size={20} /> Rules
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                                onClick={() => setActiveTab('contact')}
                            >
                                <Phone size={20} /> Contact
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'info' && (
                                <div className="content-block animate-fade-in">
                                    <h3>About the Event</h3>
                                    <p>{event.longDescription || event.description}</p>
                                </div>
                            )}

                            {activeTab === 'rules' && (
                                <div className="content-block animate-fade-in">
                                    <h3>Rules & Regulations</h3>
                                    <ul className="rules-list">
                                        {event.rules ? event.rules.map((rule, index) => (
                                            <li key={index}>{rule}</li>
                                        )) : (
                                            <li>Standard Zestopia rules apply.</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="content-block animate-fade-in">
                                    <h3>Event Coordinator</h3>
                                    <div className="contact-card">
                                        <p><strong>Name:</strong> {event.contact?.name || 'Event Team'}</p>
                                        <p><strong>Phone:</strong> {event.contact?.phone || '+91 12345 67890'}</p>
                                        <p><strong>Email:</strong> events@zestopia.edu</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="details-sidebar">
                        <div className="glass-panel cta-card">
                            <h3>Ready to join?</h3>
                            <p>Register now to secure your spot in {event.title}.</p>
                            <Link to={`/register?event=${encodeURIComponent(event.title)}`} className="btn btn-primary full-width">
                                Register Now
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetails;
