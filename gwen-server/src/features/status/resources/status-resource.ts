import { type Request, type Response, Router } from 'express';

const statusRouter = Router();

/**
 * @swagger
 * /api/status/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 */
statusRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default statusRouter;

