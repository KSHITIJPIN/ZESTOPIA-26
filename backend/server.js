const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============ SCHEMAS ============

const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    college: String,
    studentClass: String,
    gender: String,
    event: String,
    specialReq: String,
    // Dynamic event-specific fields stored as object
    eventDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now }
});

const organizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    college: String,
    studentClass: String,
    gender: String,
    teamName: String,
    role: String,
    specialReq: String,
    timestamp: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);
const Organizer = mongoose.model('Organizer', organizerSchema);

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Zestopia API is running!' });
});

// --- PARTICIPANTS ---

// Register new participant
// Register new participant
app.post('/api/participants', async (req, res) => {
    try {
        const { email, event } = req.body;

        // Check if user already registered for this specific event
        const existingParticipant = await Participant.findOne({ email, event });
        if (existingParticipant) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event!'
            });
        }

        const participant = new Participant({
            ...req.body,
            timestamp: new Date()
        });
        await participant.save();
        res.json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all participants
app.get('/api/participants', async (req, res) => {
    try {
        const data = await Participant.find().sort({ timestamp: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete all participants (admin)
app.delete('/api/participants', async (req, res) => {
    try {
        await Participant.deleteMany({});
        res.json({ success: true, message: 'All participants deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ORGANIZERS ---

// Register new organizer
app.post('/api/organizers', async (req, res) => {
    try {
        const organizer = new Organizer({
            ...req.body,
            timestamp: new Date()
        });
        await organizer.save();
        res.json({ success: true, message: 'Organizer registration successful!' });
    } catch (err) {
        console.error('Organizer Registration Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all organizers
app.get('/api/organizers', async (req, res) => {
    try {
        const data = await Organizer.find().sort({ timestamp: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete all organizers (admin)
app.delete('/api/organizers', async (req, res) => {
    try {
        await Organizer.deleteMany({});
        res.json({ success: true, message: 'All organizers deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STATS ---
app.get('/api/stats', async (req, res) => {
    try {
        const participantCount = await Participant.countDocuments();
        const organizerCount = await Organizer.countDocuments();
        res.json({ participants: participantCount, organizers: organizerCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Zestopia API running on http://localhost:${PORT}`);
});
