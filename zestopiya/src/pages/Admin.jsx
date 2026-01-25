import React, { useState, useEffect } from 'react';
import { Users, Building, Download, Trash2, ChevronRight } from 'lucide-react';
import { eventsData } from '../data/events';
import { getParticipants, getOrganizers, clearParticipants, clearOrganizers } from '../services/api';
import './Admin.css';

const Admin = () => {
    const [mainTab, setMainTab] = useState('participants');
    const [selectedEvent, setSelectedEvent] = useState('All');
    const [participants, setParticipants] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const eventNames = ['All', ...eventsData.map(e => e.title)];

    // Fetch data from MongoDB API
    const fetchData = async () => {
        setLoading(true);
        try {
            const pData = await getParticipants();
            const oData = await getOrganizers();
            setParticipants(Array.isArray(pData) ? pData : []);
            setOrganizers(Array.isArray(oData) ? oData : []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'Z_Admin' && password === 'MGMUAdmin@567') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid Username or Password');
        }
    };

    const clearData = async () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            try {
                await clearParticipants();
                await clearOrganizers();
                setParticipants([]);
                setOrganizers([]);
                alert('All data cleared from database!');
            } catch (err) {
                alert('Failed to clear data: ' + err.message);
            }
        }
    };

    const getFilteredData = () => {
        const data = mainTab === 'participants' ? participants : organizers;
        if (selectedEvent === 'All') return data;
        return data.filter(item => item.event === selectedEvent);
    };

    const filteredData = getFilteredData();

    const getEventCount = (eventName) => {
        const data = mainTab === 'participants' ? participants : organizers;
        if (eventName === 'All') return data.length;
        return data.filter(item => item.event === eventName).length;
    };

    const downloadCSV = () => {
        if (filteredData.length === 0) return alert('No data to export');

        const headers = Object.keys(filteredData[0]).join(',');
        const rows = filteredData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `zestopia_${selectedEvent.replace(/\s+/g, '_')}_export.csv`);
        document.body.appendChild(link);
        link.click();
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login container section-padding">
                <div className="glass-panel login-card">
                    <h2>Admin Access</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="admin-input"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="admin-input"
                        />
                        <button className="btn btn-primary full-width">Access Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page container section-padding">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-actions">
                    <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
                        {loading ? 'Loading...' : '🔄 Refresh'}
                    </button>
                    <button className="btn btn-ghost" onClick={clearData}><Trash2 size={18} /> Clear Data</button>
                    <button className="btn btn-primary" onClick={downloadCSV}><Download size={18} /> Export CSV</button>
                </div>
            </div>

            <div className="glass-panel admin-content">
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${mainTab === 'participants' ? 'active' : ''}`}
                        onClick={() => { setMainTab('participants'); setSelectedEvent('All'); }}
                    >
                        <Users size={18} /> Participants ({participants.length})
                    </button>
                    <button
                        className={`tab-btn ${mainTab === 'organizers' ? 'active' : ''}`}
                        onClick={() => { setMainTab('organizers'); setSelectedEvent('All'); }}
                    >
                        <Building size={18} /> Organizers ({organizers.length})
                    </button>
                </div>

                {mainTab === 'participants' && (
                    <div className="event-tabs-wrapper">
                        <div className="event-tabs">
                            {eventNames.map(eventName => (
                                <button
                                    key={eventName}
                                    className={`event-tab ${selectedEvent === eventName ? 'active' : ''}`}
                                    onClick={() => setSelectedEvent(eventName)}
                                >
                                    {eventName}
                                    <span className="event-count">{getEventCount(eventName)}</span>
                                </button>
                            ))}
                        </div>
                        <div className="scroll-hint"><ChevronRight size={16} /></div>
                    </div>
                )}

                <div className="table-responsive">
                    {loading ? (
                        <div className="loading-state">Loading data from database...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Event</th>
                                    <th>Contact</th>
                                    <th>College</th>
                                    <th>Class</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((row, index) => (
                                    <tr key={row._id || index}>
                                        <td>{filteredData.length - index}</td>
                                        <td>
                                            <div className="user-cell">
                                                <span className="user-name">{row.name}</span>
                                                <span className="user-email">{row.email}</span>
                                            </div>
                                        </td>
                                        <td>{row.event || row.teamName || '-'}</td>
                                        <td>{row.contact}</td>
                                        <td>{row.college || '-'}</td>
                                        <td>{row.studentClass}</td>
                                        <td>{new Date(row.timestamp).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="empty-state">No records found for "{selectedEvent}".</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
