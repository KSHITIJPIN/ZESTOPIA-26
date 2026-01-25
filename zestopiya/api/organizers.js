const { connectDB, Organizer } = require('./_db');

module.exports = async function handler(req, res) {
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
            const organizer = new Organizer({
                ...req.body,
                timestamp: new Date()
            });
            await organizer.save();
            return res.status(200).json({ success: true, message: 'Organizer registration successful!' });
        }

        // GET - Get all organizers
        if (req.method === 'GET') {
            const data = await Organizer.find().sort({ timestamp: -1 });
            return res.status(200).json(data);
        }

        // DELETE - Clear all organizers
        if (req.method === 'DELETE') {
            await Organizer.deleteMany({});
            return res.status(200).json({ success: true, message: 'All organizers deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
