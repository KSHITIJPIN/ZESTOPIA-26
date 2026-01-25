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
            const participant = new Participant({
                ...req.body,
                timestamp: new Date()
            });
            await participant.save();
            return res.status(200).json({ success: true, message: 'Registration successful!' });
        }

        // GET - Get all participants
        if (req.method === 'GET') {
            const data = await Participant.find().sort({ timestamp: -1 });
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
