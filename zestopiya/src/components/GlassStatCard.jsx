import React, { useEffect, useState } from 'react';
import './GlassStatCard.css';

const GlassStatCard = ({ icon: Icon, value, label, color }) => {
    const [count, setCount] = useState(0);

    // Simple count-up animation
    useEffect(() => {
        let start = 0;
        // Extract number from value string if possible (e.g. "2000+" -> 2000)
        const end = parseInt(value) || 0;
        if (end === 0) {
            setCount(value);
            return;
        }

        const duration = 2000;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(value); // Ensure final value handles suffixes like "+"
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="glass-stat-card glass">
            {Icon && <div className="stat-icon" style={{ color: `rgb(var(--${color}))` }}><Icon size={28} /></div>}
            <div className="stat-info">
                <h3 className="stat-value">{count}{isNaN(Number(value)) ? '' : '+'}</h3>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
};

export default GlassStatCard;
