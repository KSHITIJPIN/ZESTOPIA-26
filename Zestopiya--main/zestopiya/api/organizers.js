import { connectDB, Organizer } from './_db.js';

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

        // POST - Register new organizer
        if (req.method === 'POST') {
            const formData = req.body;

            // Validate contact number (exactly 10 digits)
            const contact = formData.contact ? formData.contact.replace(/\D/g, '') : '';
            if (contact.length !== 10) {
                return res.status(400).json({ success: false, message: 'Contact number must be exactly 10 digits.' });
            }

            const organizer = new Organizer({
                ...formData,
                timestamp: new Date()
            });
            await organizer.save();
            return res.status(200).json({ success: true, message: 'Organizer registration successful!' });
        }

        // GET - Get all organizers
        if (req.method === 'GET') {
            const { deleted } = req.query;
            const filter = deleted === 'true' ? { isDeleted: true } : { isDeleted: false };

            const data = await Organizer.find(filter).sort({ timestamp: -1 });
            return res.status(200).json(data);
        }

        // DELETE - Delete organizer(s)
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (id) {
                await Organizer.findByIdAndDelete(id);
                return res.status(200).json({ success: true, message: 'Organizer deleted successfully' });
            } else {
                await Organizer.deleteMany({});
                return res.status(200).json({ success: true, message: 'All organizers deleted' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
