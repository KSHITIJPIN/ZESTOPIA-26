import { connectDB, Participant, Organizer } from './_db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectDB();

        const participantCount = await Participant.countDocuments();
        const organizerCount = await Organizer.countDocuments();

        return res.status(200).json({
            participants: participantCount,
            organizers: organizerCount
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
