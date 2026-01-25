const { connectDB, Participant } = require('./_db');

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
        console.log(`=> [${req.method}] /api/participants helper started`);
        await connectDB();

        // POST - Register new participant
        if (req.method === 'POST') {
            console.log('=> Received registration data:', JSON.stringify(req.body));

            const participant = new Participant({
                ...req.body,
                timestamp: new Date()
            });

            console.log('=> Saving participant...');
            const result = await participant.save();
            console.log('=> Participant saved with ID:', result._id);

            return res.status(200).json({ success: true, message: 'Registration successful!' });
        }

        // GET - Get all participants
        if (req.method === 'GET') {
            const data = await Participant.find().sort({ timestamp: -1 });
            return res.status(200).json(data);
        }

        // DELETE - Clear all participants
        if (req.method === 'DELETE') {
            await Participant.deleteMany({});
            return res.status(200).json({ success: true, message: 'All participants deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('!!! API Error in participants.js:', error);
        // Return 500 with the actual error message for debugging
        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
            stack: error.stack
        });
    }
};
