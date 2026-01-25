const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

// Participant Schema
const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    college: String,
    studentClass: String,
    gender: String,
    event: String,
    specialReq: String,
    eventDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now }
}, { strict: false });

// Organizer Schema
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
}, { strict: false });

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', organizerSchema);

module.exports = { connectDB, Participant, Organizer };
