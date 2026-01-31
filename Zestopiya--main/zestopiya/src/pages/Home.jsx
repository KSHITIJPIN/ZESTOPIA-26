import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassStatCard from '../components/GlassStatCard';
import Countdown from '../components/Countdown';
import { getStats } from '../services/api';
import './Home.css';

const Home = () => {
    const [participantCount, setParticipantCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getStats();
                setParticipantCount(stats.participants || 0);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Experience the <br />
                            <span className="text-gradient">Magic of ZESTOPIA</span>
                        </h1>

                        <div className="hero-dates glass">
                            <Calendar size={24} className="date-icon" />
                            <span>February 5th, 6th & 7th</span>
                        </div>

                        {/* Countdown Timer */}
                        <Countdown />

                        <p className="hero-subtitle">
                            The ultimate college gathering. Join us for a week of innovation, culture, and celebration.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary">
                                Register Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </Link>
                            <Link to="/events" className="btn btn-secondary">
                                Explore Events
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <GlassStatCard icon={Users} value={participantCount > 0 ? `${participantCount}+` : "0"} label="Participants" color="primary" />
                            <GlassStatCard icon={Calendar} value="15" label="Events" color="secondary" />
                            <GlassStatCard icon={Star} value="3" label="Days of Fun" color="accent" />
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glowing-orb orb-1"></div>
                        <div className="glowing-orb orb-2"></div>
                        <div className="hero-card glass-card">
                            <h2>Live The Moment</h2>
                            <p>Music, Dance, Tech, and more.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About/Teaser Section */}
            <section className="about section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Join Zestopia?</h2>
                        <div className="header-line"></div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card glass-card">
                            <h3>Cultural Extravaganza</h3>
                            <p>Witness electrifying dance, drama, and fashion showcases that celebrate our diversity.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <h3>Creative Arts</h3>
                            <p>Unleash your creativity in reel making, art galleries, and ad mad shows.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <h3>Non-Stop Entertainment</h3>
                            <p>Food carnivals and musical nights to keep the vibe high all day long.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
