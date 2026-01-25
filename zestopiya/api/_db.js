import mongoose from 'mongoose';

// Vercel Serverless: Efficiently handle database connection caching
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        if (!process.env.MONGODB_URI) {
            throw new Error("❌ MONGODB_URI is missing in environment variables!");
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB Connected Successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('❌ MongoDB Connection Failed:', e);
        throw e;
    }

    return cached.conn;
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
});

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
});

export const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
export const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', organizerSchema);
