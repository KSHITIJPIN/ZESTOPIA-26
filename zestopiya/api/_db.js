const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }

    console.log('=> Connecting to database...');
    // Log if URI exists (don't log the actual secret!)
    console.log('=> MONGODB_URI is set:', !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is missing!');
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if no connection
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error; // This will cause the 500
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
