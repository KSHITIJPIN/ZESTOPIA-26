// Zestopia API Service - Connects to MongoDB Backend

// Use relative path for Vercel, or localhost for local development
const API_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : '/api';

// ============ PARTICIPANTS ============

const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API Request Failed');
        }
        return data;
    } else {
        const text = await response.text();
        console.error("Non-JSON API Response:", text);
        throw new Error("Server Error: Received non-JSON response from API. Check server logs.");
    }
};

export const registerParticipant = async (data) => {
    try {
        const response = await fetch(`${API_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};

export const getParticipants = async (deleted = false) => {
    try {
        const query = deleted ? '?deleted=true' : '';
        const response = await fetch(`${API_URL}/participants${query}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch Participants Error:', error);
        return [];
    }
};

export const clearParticipants = async () => {
    try {
        const response = await fetch(`${API_URL}/participants`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) {
        console.error('Clear Participants Error:', error);
        throw error;
    }
};

export const deleteParticipant = async (id) => {
    try {
        const response = await fetch(`${API_URL}/participants?id=${id}`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) {
        console.error('Delete Participant Error:', error);
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
        return await handleResponse(response);
    } catch (error) {
        console.error('Organizer Registration Error:', error);
        throw error;
    }
};

export const getOrganizers = async (deleted = false) => {
    try {
        const query = deleted ? '?deleted=true' : '';
        const response = await fetch(`${API_URL}/organizers${query}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch Organizers Error:', error);
        return [];
    }
};

export const clearOrganizers = async () => {
    try {
        const response = await fetch(`${API_URL}/organizers`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) {
        console.error('Clear Organizers Error:', error);
        throw error;
    }
};

export const deleteOrganizer = async (id) => {
    try {
        const response = await fetch(`${API_URL}/organizers?id=${id}`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) {
        console.error('Delete Organizer Error:', error);
        throw error;
    }
};

// ============ STATS ============

export const getStats = async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        return { participants: 0, organizers: 0 };
    }
};

// ============ CLEANUP & AUDIT ============

export const triggerManualCleanup = async (token) => {
    try {
        const response = await fetch(`${API_URL}/cron/cleanup`, {
            method: 'GET', // Vercel Cron usually GET
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Manual Cleanup Error:', error);
        throw error;
    }
};

export const restoreRecord = async (id, type) => {
    try {
        const response = await fetch(`${API_URL}/admin/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, type })
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Restore Error:', error);
        throw error;
    }
};
