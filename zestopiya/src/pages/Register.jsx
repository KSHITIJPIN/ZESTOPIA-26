import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { User, CreditCard, Building, AppWindow, Users, Shield } from 'lucide-react';
import { registerParticipant, registerOrganizer } from '../services/api';
import Toast from '../components/Toast';
import { eventFormConfig } from '../data/formConfig';
import { eventsData } from '../data/events';
import './Register.css';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventParam = searchParams.get('event') || '';

    // Organizer logic kept simple / mostly common fields, but user focus is on participant dynamics
    // We will apply the dynamic Config MAINLY to the Participant/Event flow as per request ("Eventwise Registration Details")
    // If Organizer tab is selected, we show basic team/volunteer fields as before.

    const [activeTab, setActiveTab] = useState(location.pathname.includes('organizer') ? 'organizer' : 'participant');

    // Initial State including all possible common keys
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        college: '', // New
        studentClass: '',
        gender: '', // New
        event: eventParam,
        specialReq: '', // New
        // Dynamic fields will be added to this object as key-values

        // Organizer specific
        teamName: '',
        role: 'Volunteer',
    });

    const [status, setStatus] = useState('idle');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => {
            if (prev.event === eventParam) return prev;
            return { ...prev, event: eventParam };
        });
    }, [eventParam]);

    // Department -> Class Mapping
    const departmentClassMap = {
        "Integrated": ["FE (I) – I", "FE (I) – II"],
        "ICBT Regular": ["FE", "SE", "TE"],
        "CSE Integrated": ["SE (I) CSE", "TE (I) CSE", "FO (I) CSE"],
        "Robotics & Ai": ["SE (I) R & AI", "TE (I) R & AI", "FO (I) R & AI", "SE R & A"],
        "Civil": ["SE (I) Civil", "TE (I) Civil"]
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle Department change specially to reset Class
        if (name === 'department') {
            setFormData(prev => ({
                ...prev,
                department: value,
                studentClass: '', // Reset class when department changes
                college: value // Keeping college synced with department for now if backend needs it, or strictly use department
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTabChange = (mode) => {
        setActiveTab(mode);
        setStatus('idle');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const isOrganizer = activeTab === 'organizer';
            const apiCall = isOrganizer ? registerOrganizer : registerParticipant;

            // Separate core fields from dynamic event fields
            // Added 'department' to core fields
            const coreFields = ['name', 'email', 'contact', 'college', 'department', 'studentClass', 'gender', 'event', 'specialReq', 'teamName', 'role'];
            const payload = { ...formData, eventDetails: {} };

            // Move dynamic fields to eventDetails
            Object.keys(formData).forEach(key => {
                if (!coreFields.includes(key)) {
                    payload.eventDetails[key] = formData[key];
                }
            });

            console.log('Submitting Payload:', payload); // Debug log

            const response = await apiCall(payload);

            setStatus('success');
            setToast({ message: response.message, type: 'success' });

            // Reset form
            const resetState = {
                name: '', email: '', contact: '', college: '', department: '', studentClass: '', gender: '',
                event: '', specialReq: '', teamName: '', role: 'Volunteer'
            };
            setFormData(resetState);

        } catch (error) {
            console.error('Registration Error:', error); // Log actual error
            setStatus('error');
            setToast({ message: error.message || "Registration failed. Please try again.", type: 'error' });
        }

        setTimeout(() => setStatus('idle'), 2000);
    };

    const isOrganizer = activeTab === 'organizer';
    const currentEventConfig = !isOrganizer && formData.event ? eventFormConfig[formData.event] : null;

    return (
        <div className="register-page container section-padding">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="form-container glass-panel">
                <div className="form-header">
                    <h2>Register for Zestopia</h2>
                    <p>Sign up to participate or help organize the events.</p>
                </div>

                {/* Segmented Control Tab Switcher */}
                <div className="segmented-control" role="tablist">
                    <button
                        className={`segment-btn ${activeTab === 'participant' ? 'active' : ''}`}
                        onClick={() => handleTabChange('participant')}
                    >
                        <User size={18} /> Participant
                    </button>
                    <button
                        className={`segment-btn ${activeTab === 'organizer' ? 'active' : ''}`}
                        onClick={() => handleTabChange('organizer')}
                    >
                        <AppWindow size={18} /> Organizer
                    </button>
                    <button
                        className="segment-btn"
                        onClick={() => navigate('/admin')}
                    >
                        <Shield size={18} /> Admin
                    </button>
                    <div className={`segment-indicator ${activeTab}`} />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* --- COMMON DETAILS --- */}
                    <h3 className="form-section-title">Personal Details</h3>
                    <div className="form-group">
                        <label><User size={20} /> Full Name / Leader Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label><CreditCard size={20} /> Contact Number</label>
                        <div className="input-group">
                            <span className="input-prefix">+91</span>
                            <input
                                type="tel"
                                name="contact"
                                required
                                value={formData.contact}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                    if (val.length <= 10) {
                                        setFormData(prev => ({ ...prev, contact: val }));
                                    }
                                }}
                                placeholder=""
                                pattern="[0-9]{10}"
                                title="Please enter exactly 10 digits"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label><Building size={20} /> Department</label>
                            <select name="department" required value={formData.department || ''} onChange={handleChange}>
                                <option value="">Select Department</option>
                                {Object.keys(departmentClassMap).map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label><Users size={20} /> Class / Year</label>
                            <select
                                name="studentClass"
                                required
                                value={formData.studentClass}
                                onChange={handleChange}
                                disabled={!formData.department}
                                className={!formData.department ? 'disabled-input' : ''}
                            >
                                <option value="">{formData.department ? "Select Class" : "Select Department first"}</option>
                                {formData.department && departmentClassMap[formData.department]?.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" required value={formData.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {/* Optional Special Req move to bottom */}
                    </div>

                    {/* --- EVENT SELECTION --- */}
                    {!isOrganizer && (
                        <div className="form-group">
                            <label>Select Event</label>
                            <select name="event" required={!isOrganizer} value={formData.event} onChange={handleChange}>
                                <option value="">-- Choose an Event --</option>
                                {eventsData
                                    .filter(ev => {
                                        // Mr. & Ms. Freshers 2026 only for specific classes
                                        if (ev.title === "Mr. & Ms. Freshers 2026") {
                                            const eligibleClasses = [
                                                "FE (I) – I",
                                                "FE (I) – II",
                                                "FE",
                                                "FO (I) CSE",
                                                "FO (I) R & AI"
                                            ];
                                            return eligibleClasses.includes(formData.studentClass);
                                        }
                                        return true;
                                    })
                                    .map(ev => (
                                        <option key={ev.id} value={ev.title}>{ev.title}</option>
                                    ))
                                }
                            </select>
                        </div>
                    )}

                    {/* --- DYNAMIC EVENT FIELDS --- */}
                    {currentEventConfig && (
                        <div className="dynamic-fields animate-fade-in">
                            <h3 className="form-section-title">Event Specific Details</h3>
                            <div className="row dynamic-row">
                                {currentEventConfig.map((field) => {
                                    // check condition if exists
                                    if (field.condition && !field.condition(formData)) return null;

                                    return (
                                        <div className="form-group" key={field.name} style={{ flex: '1 1 45%' }}>
                                            <label>{field.label}</label>
                                            {field.type === 'select' ? (
                                                <select name={field.name} required={field.required} value={formData[field.name] || ''} onChange={handleChange}>
                                                    <option value="">Select...</option>
                                                    {field.options.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'notice' ? (
                                                <div className="form-notice">
                                                    ⚠️ {field.label}
                                                </div>
                                            ) : field.type === 'checkbox' ? (
                                                <div className="checkbox-wrapper">
                                                    <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={handleChange} />
                                                    <span>Yes</span>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    required={field.required}
                                                    value={formData[field.name] || ''}
                                                    onChange={handleChange}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Team Name - Available for both now */}
                    <div className="form-group">
                        <label>Team Name {isOrganizer ? '' : '(Optional)'}</label>
                        <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder={isOrganizer ? "Alpha Squad" : "Enter Team Name if applicable"} />
                    </div>

                    <div className="form-group">
                        <label>Any Special Requirement (Optional)</label>
                        <textarea name="specialReq" value={formData.specialReq} onChange={handleChange} placeholder="e.g. Need extra mic stand" rows="2"></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Processing...' : 'Register Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
