import { runCleanupSession } from '../services/cleanupService.js';
import { verifyCronSecret } from '../middleware/auth.js';

export default async function handler(req, res) {
    try {
        // Security Check
        verifyCronSecret(req);

        // Run Logic
        const result = await runCleanupSession('CRON_JOB');

        res.status(200).json({
            success: true,
            timestamp: new Date(),
            ...result
        });

    } catch (error) {
        console.error('Cron Job Failed:', error);
        res.status(error.message === 'Unauthorized: Invalid Cron Secret' ? 401 : 500).json({
            success: false,
            error: error.message
        });
    }
}
