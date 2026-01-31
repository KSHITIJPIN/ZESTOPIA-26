export default async function handler(req, res) {
    /* eslint-env node */
    require('dotenv').config();
    res.status(200).json({
        message: 'API is working! If you see this, Vercel functions are running correctly.',
        env_check: process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is MISSING'
    });
}
