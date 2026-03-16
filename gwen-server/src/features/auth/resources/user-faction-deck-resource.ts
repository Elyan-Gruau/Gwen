import { Router, Request, Response } from 'express';
import { UserFactionDeckService } from '../services/UserFactionDeckService.js';

const userFactionDeckRouter = Router();
const userFactionDeckService = new UserFactionDeckService();

// Get all decks for a user
userFactionDeckRouter.get('/:userId/decks', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const decks = await userFactionDeckService.getUserFactionDecks(userId);
    res.json(decks);
  } catch (error) {
    console.error('Error fetching user faction decks:', error);
    res.status(500).json({ error: 'Failed to fetch user faction decks' });
  }
});

// Get a specific deck for a user and faction
userFactionDeckRouter.get('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const { userId, factionId } = req.params;
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

// Create a new deck for a user and faction
userFactionDeckRouter.post('/:userId/decks', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { factionId } = req.body;

    if (!factionId) {
      return res.status(400).json({ error: 'factionId is required' });
    }

    const existingDeck = await userFactionDeckService.getUserFactionDeck(userId, factionId);
    if (existingDeck) {
      return res.status(409).json({ error: 'Deck already exists for this faction' });
    }

    const newDeck = await userFactionDeckService.createUserFactionDeck(userId, factionId);
    res.status(201).json(newDeck);
  } catch (error) {
    console.error('Error creating user faction deck:', error);
    res.status(500).json({ error: 'Failed to create user faction deck' });
  }
});

// Update a deck
userFactionDeckRouter.put('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const { userId, factionId } = req.params;
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
    res.json(result);
  } catch (error) {
    console.error('Error updating user faction deck:', error);
    res.status(500).json({ error: 'Failed to update user faction deck' });
  }
});

// Delete a deck
userFactionDeckRouter.delete('/:userId/decks/:factionId', async (req: Request, res: Response) => {
  try {
    const { userId, factionId } = req.params;
    const success = await userFactionDeckService.deleteUserFactionDeck(userId, factionId);
    if (!success) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user faction deck:', error);
    res.status(500).json({ error: 'Failed to delete user faction deck' });
  }
});

export default userFactionDeckRouter;

