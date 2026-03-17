import { type Request, type Response, Router } from 'express';
import { UserFactionDeckService } from '../services/UserFactionDeckService.js';

const userFactionDeckRouter = Router();
const userFactionDeckService = new UserFactionDeckService();

/**
 * @swagger
 * /api/user/{userId}/decks:
 *   get:
 *     summary: Get all faction decks for a user
 *     tags:
 *       - User Faction Decks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of user faction decks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserFactionDeck'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userFactionDeckRouter.get('/:userId/decks', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const decks = await userFactionDeckService.getUserFactionDecks(userId);
    res.json(decks);
  } catch (error) {
    console.error('Error fetching user faction decks:', error);
    res.status(500).json({ error: 'Failed to fetch user faction decks' });
  }
});

/**
 * @swagger
 * /api/user/{userId}/decks/{factionId}:
 *   get:
 *     summary: Get a specific faction deck for a user
 *     tags:
 *       - User Faction Decks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: factionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The faction ID
 *     responses:
 *       200:
 *         description: User faction deck
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFactionDeck'
 *       404:
 *         description: Deck not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userFactionDeckRouter.get('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const factionId = req.params.factionId as string;
    const deck = await userFactionDeckService.getUserFactionDeck(userId, factionId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(deck);
  } catch (error) {
    console.error('Error fetching user faction deck:', error);
    res.status(500).json({ error: 'Failed to fetch user faction deck' });
  }
});

/**
 * @swagger
 * /api/user/{userId}/decks:
 *   post:
 *     summary: Create a new faction deck for a user
 *     tags:
 *       - User Faction Decks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               factionId:
 *                 type: string
 *                 description: The faction ID
 *             required:
 *               - factionId
 *     responses:
 *       201:
 *         description: Faction deck created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFactionDeck'
 *       400:
 *         description: Missing factionId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Deck already exists for this faction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userFactionDeckRouter.post('/:userId/decks', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { factionId } = req.body;

    if (!factionId) {
      return res.status(400).json({ error: 'factionId is required' });
    }

    const existingDeck = await userFactionDeckService.getUserFactionDeck(userId, factionId);
    if (existingDeck) {
      return res.status(409).json({ error: 'Deck already exists for this faction' });
    }

    const newDeck = await userFactionDeckService.createUserFactionDeck(userId, factionId);
    console.info(`Created new user faction deck for user ${userId} and faction ${factionId}`);
    res.status(201).json(newDeck);
  } catch (error) {
    console.error('Error creating user faction deck:', error);
    res.status(500).json({ error: 'Failed to create user faction deck' });
  }
});

/**
 * @swagger
 * /api/user/{userId}/decks/{factionId}:
 *   put:
 *     summary: Update a faction deck
 *     tags:
 *       - User Faction Decks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: factionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The faction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaderCardId:
 *                 type: string
 *                 nullable: true
 *               unitCardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialCardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Faction deck updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFactionDeck'
 *       404:
 *         description: Deck not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userFactionDeckRouter.put('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const factionId = req.params.factionId as string;
    const { leaderCardId, unitCardIds, specialCardIds } = req.body;

    const existingDeck = await userFactionDeckService.getUserFactionDeck(userId, factionId);
    if (!existingDeck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const updatedDeck = {
      ...existingDeck,
      leader_card_id: leaderCardId || existingDeck.leader_card_id,
      unit_card_ids: unitCardIds || existingDeck.unit_card_ids,
      special_card_ids: specialCardIds || existingDeck.special_card_ids,
    };

    const result = await userFactionDeckService.updateUserFactionDeck(updatedDeck);
    console.info(`Updated user faction deck for user ${userId} and faction ${factionId}`);
    res.json(result);
  } catch (error) {
    console.error('Error updating user faction deck:', error);
    res.status(500).json({ error: 'Failed to update user faction deck' });
  }
});

/**
 * @swagger
 * /api/user/{userId}/decks/{factionId}:
 *   delete:
 *     summary: Delete a faction deck
 *     tags:
 *       - User Faction Decks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: factionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The faction ID
 *     responses:
 *       204:
 *         description: Faction deck deleted
 *       404:
 *         description: Deck not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userFactionDeckRouter.delete('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const factionId = req.params.factionId as string;
    const success = await userFactionDeckService.deleteUserFactionDeck(userId, factionId);
    if (!success) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    console.info(`Deleted user faction deck for user ${userId} and faction ${factionId}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user faction deck:', error);
    res.status(500).json({ error: 'Failed to delete user faction deck' });
  }
});

export default userFactionDeckRouter;
