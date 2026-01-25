import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ id, title, category, date, time, location, description, image }) => {
    return (
        <div className="event-card glass-card">
            <Link to={`/events/${id}`} className="card-link-wrapper">
                <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
                    <div className="category-tag">{category}</div>
                </div>
                <div className="card-content">
                    <h3>{title}</h3>
                    <p className="description">{description}</p>

                    <div className="card-details">
                        <div className="detail"><Calendar size={20} /> {date}</div>
                        <div className="detail"><Clock size={20} /> {time}</div>
                        <div className="detail"><MapPin size={20} /> {location}</div>
                    </div>
                </div>
            </Link>

            <div style={{ padding: '0 24px 24px' }}>
                <Link to={`/register?event=${encodeURIComponent(title)}`} className="btn btn-primary full-width">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
