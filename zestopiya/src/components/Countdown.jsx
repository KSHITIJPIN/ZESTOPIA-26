import React, { useState, useEffect, useRef } from 'react';
import './Countdown.css';

const TARGET_DATE = new Date('February 7, 2026 00:00:00').getTime();

// Calculate time remaining until target
const getTimeRemaining = () => {
    const now = new Date().getTime();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
};

// Single flip card for one digit
const FlipCard = ({ digit, prevDigit }) => {
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        if (digit !== prevDigit) {
            setFlip(true);
            const timer = setTimeout(() => setFlip(false), 600);
            return () => clearTimeout(timer);
        }
    }, [digit, prevDigit]);

    const currentDigit = String(digit);
    const previousDigit = String(prevDigit);

    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                {/* Static top half showing current number */}
                <div className="card-face card-top">
                    <span>{currentDigit}</span>
                </div>

                {/* Static bottom half showing previous number */}
                <div className="card-face card-bottom">
                    <span>{previousDigit}</span>
                </div>

                {/* Animated top flap */}
                <div className={`card-face card-flap-top ${flip ? 'flip' : ''}`}>
                    <span>{previousDigit}</span>
                </div>

                {/* Animated bottom flap */}
                <div className={`card-face card-flap-bottom ${flip ? 'flip' : ''}`}>
                    <span>{currentDigit}</span>
                </div>
            </div>
        </div>
    );
};

// A bloc showing two digits (e.g., "05" for hours)
const FlipUnit = ({ value, prevValue, label }) => {
    const current = String(value).padStart(2, '0');
    const previous = String(prevValue).padStart(2, '0');

    return (
        <div className="flip-unit">
            <div className="flip-unit-cards">
                <FlipCard digit={current[0]} prevDigit={previous[0]} />
                <FlipCard digit={current[1]} prevDigit={previous[1]} />
            </div>
            <span className="flip-unit-label">{label}</span>
        </div>
    );
};

const Countdown = () => {
    const [time, setTime] = useState(getTimeRemaining());
    const prevTimeRef = useRef(time);

    useEffect(() => {
        const interval = setInterval(() => {
            prevTimeRef.current = time;
            setTime(getTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    const prevTime = prevTimeRef.current;

    return (
        <div className="countdown-wrapper">
            <FlipUnit value={time.days} prevValue={prevTime.days} label="Days" />
            <FlipUnit value={time.hours} prevValue={prevTime.hours} label="Hours" />
            <FlipUnit value={time.minutes} prevValue={prevTime.minutes} label="Minutes" />
            <FlipUnit value={time.seconds} prevValue={prevTime.seconds} label="Seconds" />
        </div>
    );
};

export default Countdown;
