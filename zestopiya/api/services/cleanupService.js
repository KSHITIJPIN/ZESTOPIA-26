import mongoose from 'mongoose';
import { Participant, Organizer, AuditLog, connectDB } from '../_db.js';

// --- Logic ---

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const normalizeEmail = (email) => {
    return email ? email.trim().toLowerCase() : '';
};

// --- Core Service ---

export const runCleanupSession = async (initiatedBy = 'SYSTEM') => {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    const logs = [];
    let deletedCount = 0;

    try {
        console.log(`🧹 Starting Cleanup Session [${initiatedBy}]...`);

        // 1. Invalid Emails
        const invalidResults = await cleanupInvalidEmails(Participant, 'Participant', session);
        logs.push(...invalidResults.logs);
        deletedCount += invalidResults.count;

        // 2. Duplicates (Participant)
        const dupResults = await cleanupDuplicates(Participant, 'Participant', session);
        logs.push(...dupResults.logs);
        deletedCount += dupResults.count;

        // 3. Duplicates (Organizer)
        const orgDupResults = await cleanupDuplicates(Organizer, 'Organizer', session);
        logs.push(...orgDupResults.logs);
        deletedCount += orgDupResults.count;

        await session.commitTransaction();
        console.log(`✅ Cleanup Complete. Removed ${deletedCount} records.`);

        return { success: true, deletedCount, logs };

    } catch (error) {
        await session.abortTransaction();
        console.error('❌ Cleanup Failed - Transaction Aborted:', error);
        throw error;
    } finally {
        session.endSession();
    }
};

// --- Helpers ---

const cleanupInvalidEmails = async (Model, collectionName, session) => {
    const invalids = await Model.find({
        isDeleted: false
    }).session(session);

    let count = 0;
    const logs = [];

    for (const doc of invalids) {
        if (!validateEmail(doc.email)) {
            doc.isDeleted = true;
            doc.deletedAt = new Date();
            doc.deletionMetadata = { reason: 'Invalid Email Syntax', automated: true };
            await doc.save({ session });

            // Audit
            const log = new AuditLog({
                action: 'AUTO_CLEANUP',
                entityId: doc._id,
                collectionName,
                details: { reason: 'Invalid Email', oldValue: doc.email }
            });
            await log.save({ session });

            count++;
            logs.push(`Invalid: ${doc.email}`);
        }
    }
    return { count, logs };
};

const cleanupDuplicates = async (Model, collectionName, session) => {
    // Aggregation to find duplicates
    const duplicates = await Model.aggregate([
        { $match: { isDeleted: false } }, // Only check active records
        {
            $group: {
                _id: { $toLower: "$email" }, // Normalize email
                uniqueIds: { $addToSet: "$_id" },
                count: { $sum: 1 },
                docs: { $push: { _id: "$_id", timestamp: "$timestamp", email: "$email" } }
            }
        },
        { $match: { count: { $gt: 1 } } }
    ]).session(session);

    let count = 0;
    const logs = [];

    for (const group of duplicates) {
        // Sort by timestamp DESC (Keep latest)
        const sortedDocs = group.docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Keep index 0, delete the rest
        const toDelete = sortedDocs.slice(1);

        for (const doc of toDelete) {
            await Model.findByIdAndUpdate(doc._id, {
                isDeleted: true,
                deletedAt: new Date(),
                deletionMetadata: { reason: 'Duplicate Entry', automated: true, keptId: sortedDocs[0]._id }
            }).session(session);

            // Audit
            await new AuditLog({
                action: 'AUTO_CLEANUP',
                entityId: doc._id,
                collectionName,
                details: { reason: 'Duplicate', duplicateOf: sortedDocs[0]._id }
            }).save({ session });

            count++;
            logs.push(`Duplicate: ${doc.email}`);
        }
    }

    return { count, logs };
};
