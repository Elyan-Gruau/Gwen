import { type Request, type Response, Router } from 'express';
import { GameService } from '../services/GameService.js';

const gameRouter = Router();
const gameService = new GameService();

/**
 * @swagger
 * /api/games/{gameId}:
 *   get:
 *     summary: Get a game by ID
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     responses:
 *       200:
 *         description: Game details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 player1_id:
 *                   type: string
 *                 player2_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: ['ACTIVE', 'FINISHED', 'ABANDONED']
 *                 winner_id:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
gameRouter.get('/:gameId', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.gameId as string;
    const game = await gameService.getGame(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ error: 'Failed to retrieve game' });
  }
});

/**
 * @swagger
 * /api/games/{gameId}/finish:
 *   post:
 *     summary: Finish a game with a winner
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               winnerId:
 *                 type: string
 *             required:
 *               - winnerId
 *     responses:
 *       200:
 *         description: Game finished successfully
 *       404:
 *         description: Game not found
 *       400:
 *         description: Missing winnerId
 *       500:
 *         description: Server error
 */
gameRouter.post('/:gameId/finish', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.gameId as string;
    const { winnerId } = req.body;

    if (!winnerId) {
      return res.status(400).json({ error: 'winnerId is required' });
    }

    const updatedGame = await gameService.finishGame(gameId, winnerId);

    if (!updatedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(updatedGame);
  } catch (error) {
    console.error('Error finishing game:', error);
    res.status(500).json({ error: 'Failed to finish game' });
  }
});

/**
 * @swagger
 * /api/games/{gameId}/abandon:
 *   post:
 *     summary: Abandon a game
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     responses:
 *       200:
 *         description: Game abandoned successfully
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
gameRouter.post('/:gameId/abandon', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.gameId as string;
    const updatedGame = await gameService.abandonGame(gameId);

    if (!updatedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(updatedGame);
  } catch (error) {
    console.error('Error abandoning game:', error);
    res.status(500).json({ error: 'Failed to abandon game' });
  }
});

export default gameRouter;

