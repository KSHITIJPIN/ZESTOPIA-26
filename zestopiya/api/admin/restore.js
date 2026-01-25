import { connectDB, Participant, Organizer, AuditLog } from '../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, type } = req.body; // type: 'participant' | 'organizer'

    try {
        await connectDB();

        const Model = type === 'organizer' ? Organizer : Participant;
        const colName = type === 'organizer' ? 'Organizer' : 'Participant';

        const doc = await Model.findById(id);

        if (!doc) {
            return res.status(404).json({ error: 'Record not found' });
        }

        if (!doc.isDeleted) {
            return res.status(400).json({ message: 'Record is active, no need to restore.' });
        }

        // Restore
        doc.isDeleted = false;
        doc.deletedAt = undefined;
        doc.deletionMetadata = undefined;
        await doc.save();

        // Audit Log
        await new AuditLog({
            action: 'RESTORE',
            entityId: doc._id,
            collectionName: colName,
            performedBy: 'ADMIN',
            details: { reason: 'Manual Restore' }
        }).save();

        return res.status(200).json({ success: true, message: 'Record Restored Successfully' });

    } catch (error) {
        console.error('Restore Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
