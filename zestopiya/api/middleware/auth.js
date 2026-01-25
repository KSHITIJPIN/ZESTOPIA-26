// Basic Authorization Middleware for Cron Jobs
export const verifyCronSecret = (req) => {
    const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;

    // In Vercel, Cron jobs automatically send a specialized header
    // Or we can use a manual CRON_SECRET env var
    const validSecret = process.env.CRON_SECRET;

    if (!validSecret) {
        console.warn('⚠️ CRON_SECRET is not set in environment variables. allowing request (unsafe in production).');
        return true;
    }

    if (authHeader !== `Bearer ${validSecret}`) {
        throw new Error('Unauthorized: Invalid Cron Secret');
    }

    return true;
};
