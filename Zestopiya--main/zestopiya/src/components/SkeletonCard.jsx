import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
    return (
        <div className="skeleton-card glass-card">
            <div className="skeleton-image shimmer"></div>
            <div className="skeleton-content">
                <div className="skeleton-title shimmer"></div>
                <div className="skeleton-text shimmer"></div>
                <div className="skeleton-text shimmer" style={{ width: '80%' }}></div>

                <div className="skeleton-details">
                    <div className="skeleton-line shimmer"></div>
                    <div className="skeleton-line shimmer"></div>
                    <div className="skeleton-line shimmer"></div>
                </div>

                <div className="skeleton-btn shimmer"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
