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
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    contact: { type: String, required: true, trim: true },
    college: String,
    studentClass: String,
    gender: String,
    event: String,
    specialReq: String,
    eventDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Soft Deletion & Metadata
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletionMetadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
});

// Organizer Schema
const organizerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contact: { type: String, required: true, trim: true },
    college: String,
    studentClass: String,
    gender: String,
    teamName: String,
    role: String,
    specialReq: String,
    // Soft Deletion & Metadata
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletionMetadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
});

// Audit Log Schema (Immutable History)
const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true, enum: ['SOFT_DELETE', 'RESTORE', 'PURGE', 'AUTO_CLEANUP'] },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    collectionName: { type: String, required: true },
    performedBy: { type: String, default: 'SYSTEM' }, // 'SYSTEM' or Admin Username
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 } // Auto-expire after 90 days
});

export const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
export const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', organizerSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
