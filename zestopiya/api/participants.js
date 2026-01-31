import { connectDB, Participant } from './_db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectDB();

        // POST - Register new participant
        if (req.method === 'POST') {
            const formData = req.body;

            // Normalize email if provided (optional)
            const normalizedEmail = formData.email ? formData.email.trim().toLowerCase() : '';

            // 1. Basic Validation - Only name is required, email is optional
            if (!formData.name) {
                return res.status(400).json({ success: false, message: 'Name is required.' });
            }

            // 2. Contact Number Validation (exactly 10 digits)
            const contact = formData.contact ? formData.contact.replace(/\D/g, '') : '';
            if (contact.length !== 10) {
                return res.status(400).json({ success: false, message: 'Contact number must be exactly 10 digits.' });
            }

            // 3. Check Duplicate using contact number and event (Active only)
            const existing = await Participant.findOne({
                contact: contact,
                event: formData.event,
                isDeleted: false
            });

            if (existing) {
                return res.status(409).json({ success: false, message: 'You have already registered for this event!' });
            }

            const participant = new Participant({
                ...formData,
                email: normalizedEmail, // Save normalized
                timestamp: new Date()
            });

            try {
                await participant.save();
                return res.status(200).json({ success: true, message: 'Registration successful!' });
            } catch (saveError) {
                // Handle Race Condition / Unique Constraint
                if (saveError.code === 11000) {
                    return res.status(409).json({ success: false, message: 'Duplicate registration detected.' });
                }
                throw saveError;
            }
        }

        // GET - Get all participants
        if (req.method === 'GET') {
            const { deleted } = req.query;
            const filter = deleted === 'true' ? { isDeleted: true } : { isDeleted: false };

            const data = await Participant.find(filter).sort({ timestamp: -1 });
            return res.status(200).json(data);
        }

        // DELETE - Delete participant(s)
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (id) {
                // Delete specific participant
                await Participant.findByIdAndDelete(id);
                return res.status(200).json({ success: true, message: 'Participant deleted successfully' });
            } else {
                // Delete all (Clear Data)
                await Participant.deleteMany({});
                return res.status(200).json({ success: true, message: 'All participants deleted' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
