// Zestopia API Service - Connects to MongoDB Backend

// Use relative path for Vercel, or localhost for local development
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

// ============ PARTICIPANTS ============

export const registerParticipant = async (data) => {
    try {
        const response = await fetch(`${API_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};

export const getParticipants = async () => {
    try {
        const response = await fetch(`${API_URL}/participants`);
        return await response.json();
    } catch (error) {
        console.error('Fetch Participants Error:', error);
        return [];
    }
};

export const clearParticipants = async () => {
    try {
        const response = await fetch(`${API_URL}/participants`, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        console.error('Clear Participants Error:', error);
        throw error;
    }
};

// ============ ORGANIZERS ============

export const registerOrganizer = async (data) => {
    try {
        const response = await fetch(`${API_URL}/organizers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Organizer Registration Error:', error);
        throw error;
    }
};

export const getOrganizers = async () => {
    try {
        const response = await fetch(`${API_URL}/organizers`);
        return await response.json();
    } catch (error) {
        console.error('Fetch Organizers Error:', error);
        return [];
    }
};

export const clearOrganizers = async () => {
    try {
        const response = await fetch(`${API_URL}/organizers`, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        console.error('Clear Organizers Error:', error);
        throw error;
    }
};

// ============ STATS ============

export const getStats = async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);
        return await response.json();
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        return { participants: 0, organizers: 0 };
    }
};
