import React, { useState, useEffect } from 'react';
import { Users, Building, Download, Trash2, ChevronRight, RefreshCw, RotateCcw } from 'lucide-react';
import { eventsData } from '../data/events';
import { getParticipants, getOrganizers, clearParticipants, clearOrganizers, deleteParticipant, deleteOrganizer, triggerManualCleanup, restoreRecord } from '../services/api';
import './Admin.css';

const Admin = () => {
    const [mainTab, setMainTab] = useState('participants'); // 'participants', 'organizers', 'trash'
    const [selectedEvent, setSelectedEvent] = useState('All');
    const [participants, setParticipants] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [deletedItems, setDeletedItems] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const eventNames = ['All', ...eventsData.map(e => e.title)];

    // Fetch data from MongoDB API
    const fetchData = async () => {
        setLoading(true);
        try {
            if (mainTab === 'trash') {
                const pDeleted = await getParticipants(true); // fetch deleted
                const oDeleted = await getOrganizers(true);
                // Combine and add type
                const combined = [
                    ...pDeleted.map(i => ({ ...i, type: 'participant' })),
                    ...oDeleted.map(i => ({ ...i, type: 'organizer' }))
                ];
                setDeletedItems(combined.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)));
            } else {
                const pData = await getParticipants();
                const oData = await getOrganizers();
                setParticipants(Array.isArray(pData) ? pData : []);
                setOrganizers(Array.isArray(oData) ? oData : []);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, mainTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'Z_Admin' && password === 'MGMUAdmin@567') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid Username or Password');
        }
    };

    const runCleanup = async () => {
        if (confirm('Run automated cleanup? This will detect and delete invalid/duplicate emails.')) {
            setLoading(true);
            try {
                // Use a proper secret in production, for now just trigger
                const result = await triggerManualCleanup(process.env.CRON_SECRET || '');
                alert(`Cleanup Complete.\nRecords Removed: ${result.deletedCount || 0}`);
                fetchData();
            } catch (err) {
                alert('Cleanup Failed: ' + err.message);
            }
            setLoading(false);
        }
    };

    const handleRestore = async (id, type) => {
        if (confirm('Restore this record?')) {
            try {
                await restoreRecord(id, type);
                setDeletedItems(prev => prev.filter(i => i._id !== id));
            } catch (err) {
                alert('Restore failed: ' + err.message);
            }
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

    const handleDelete = async (id, name) => {
        if (confirm(`Are you sure you want to remove "${name}"?`)) {
            try {
                if (mainTab === 'participants') {
                    await deleteParticipant(id);
                    setParticipants(prev => prev.filter(p => p._id !== id));
                } else {
                    await deleteOrganizer(id);
                    setOrganizers(prev => prev.filter(o => o._id !== id));
                }
            } catch (err) {
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    const getFilteredData = () => {
        if (mainTab === 'trash') return deletedItems;
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
                    <button className="btn btn-ghost" onClick={runCleanup} disabled={loading} title="Find & remove bad emails">
                        <RefreshCw size={18} /> Auto-Cleanup
                    </button>
                    <button className="btn btn-ghost" onClick={clearData}><Trash2 size={18} /> Reset DB</button>
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
                    <button
                        className={`tab-btn ${mainTab === 'trash' ? 'active' : ''}`}
                        onClick={() => { setMainTab('trash'); setSelectedEvent('All'); }}
                        style={{ color: '#ff6b6b' }}
                    >
                        <Trash2 size={18} /> Trash ({deletedItems.length})
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
                                    {mainTab !== 'trash' && <th>Class</th>}
                                    {mainTab !== 'trash' && <th>Type</th>}
                                    {mainTab === 'trash' && <th>Deletion Reason</th>}
                                    {mainTab === 'trash' && <th>Deleted At</th>}
                                    {mainTab !== 'trash' && <th>Time</th>}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((row, index) => {
                                    // Helper to extract "Type" based on event
                                    const details = row.eventDetails || {};
                                    const eventType = details.danceType ||
                                        details.performerType ||
                                        details.participantType ||
                                        details.artType ||
                                        details.type ||
                                        (details.participantCount > 1 ? 'Group' : 'Solo');

                                    const isTrash = mainTab === 'trash';
                                    const meta = row.deletionMetadata || {};

                                    return (
                                        <tr key={row._id || index} className={isTrash ? 'trash-row' : ''}>
                                            <td>{filteredData.length - index}</td>
                                            <td>
                                                <div className="user-cell">
                                                    <span className="user-name">{row.name}</span>
                                                    <span className="user-email">{row.email}</span>
                                                </div>
                                            </td>
                                            <td>{row.event || row.teamName || (row.type === 'organizer' ? 'Organizer' : '-')}</td>
                                            <td>{row.contact}</td>

                                            {!isTrash && <td>{row.studentClass || '-'}</td>}
                                            {!isTrash && (
                                                <td>
                                                    <span className={`badge-type ${eventType ? eventType.toLowerCase() : ''}`}>
                                                        {eventType || '-'}
                                                    </span>
                                                </td>
                                            )}

                                            {isTrash && (
                                                <td>
                                                    <span className="deletion-reason">
                                                        {meta.reason || 'Manual Delete'}
                                                    </span>
                                                </td>
                                            )}
                                            {isTrash && <td>{new Date(row.deletedAt).toLocaleString()}</td>}

                                            {!isTrash && <td>{new Date(row.timestamp).toLocaleString()}</td>}

                                            <td>
                                                {isTrash ? (
                                                    <button
                                                        className="btn-icon-restore"
                                                        onClick={() => handleRestore(row._id, row.type || 'participant')}
                                                        title="Restore Record"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-icon-danger"
                                                        onClick={() => handleDelete(row._id, row.name)}
                                                        title="Delete Entry"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="9" className="empty-state">No records found for "{selectedEvent}".</td>
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
