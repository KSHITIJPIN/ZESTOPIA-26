import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import './Events.css';

import { eventsData } from '../data/events';

const Events = () => {
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    // Updated categories based on new events
    const categories = ['All', 'Cultural', 'Music', 'Arts', 'Food'];

    useEffect(() => {
        // Simulate API fetch latency
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const filteredEvents = filter === 'All'
        ? eventsData
        : eventsData.filter(event => event.category === filter);

    return (
        <div className="events-page container section-padding">
            <div className="section-header">
                <h2>Explore Events</h2>
                <div className="header-line"></div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="events-grid">
                {isLoading ? (
                    // Show 6 skeleton cards while loading
                    Array(6).fill(0).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    filteredEvents.map(event => (
                        <EventCard key={event.id} {...event} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;
