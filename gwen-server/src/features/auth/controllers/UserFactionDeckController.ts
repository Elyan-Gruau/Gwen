import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Put,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { UserFactionDeckService } from '../services/UserFactionDeckService.js';
import type {
  DTOUpdateUserFactionDeckRequest,
  DTOUserFactionDeck,
} from '../dtos/DTOUserFactionDeck.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

const userFactionDeckService = new UserFactionDeckService();

@Route('user')
@Tags('User Faction Decks')
export class UserFactionDeckController extends Controller {
  @Get('{userId}/decks')
  @SuccessResponse('200', 'List of user faction decks')
  @Response('500', 'Server error')
  public async getUserFactionDecks(@Path() userId: string): Promise<DTOUserFactionDeck[]> {
    try {
      const decks = await userFactionDeckService.getUserFactionDecks(userId);
      return decks.map((deck) => this.toDto(deck));
    } catch (error) {
      return this.throwHttpError('Failed to fetch user faction decks', 500);
    }
  }

  @Get('{userId}/decks/{factionId}')
  @SuccessResponse('200', 'User faction deck')
  @Response('500', 'Server error')
  public async getOrCreateUserFactionDeck(
    @Path() userId: string,
    @Path() factionId: string,
  ): Promise<DTOUserFactionDeck> {
    try {
      const deck = await userFactionDeckService.getOrCreateUserFactionDeck(userId, factionId);
      return this.toDto(deck);
    } catch (error) {
      return this.throwHttpError('Failed to fetch user faction deck', 500);
    }
  }

  @Put('{userId}/decks/{factionId}')
  @SuccessResponse('200', 'Faction deck updated')
  @Response('404', 'Deck not found')
  @Response('500', 'Server error')
  public async updateUserFactionDeck(
    @Path() userId: string,
    @Path() factionId: string,
    @Body() body: DTOUpdateUserFactionDeckRequest,
  ): Promise<DTOUserFactionDeck> {
    try {
      const existingDeck = await userFactionDeckService.getUserFactionDeck(userId, factionId);
      if (!existingDeck) {
        return this.throwHttpError('Deck not found', 404);
      }

      const deckToUpdate: DBUserFactionDeck = {
        ...existingDeck,
        leader_card_id: body.leaderCardId ?? existingDeck.leader_card_id,
        unit_card_ids: body.unitCardIds ?? existingDeck.unit_card_ids,
        special_card_ids: body.specialCardIds ?? existingDeck.special_card_ids,
      };

      const result = await userFactionDeckService.updateUserFactionDeck(deckToUpdate);
      return this.toDto(result);
    } catch (error) {
      return this.throwHttpError('Failed to update user faction deck', 500);
    }
  }

  @Delete('{userId}/decks/{factionId}')
  @SuccessResponse('204', 'Faction deck deleted')
  @Response('404', 'Deck not found')
  @Response('500', 'Server error')
  public async deleteUserFactionDeck(
    @Path() userId: string,
    @Path() factionId: string,
  ): Promise<void> {
    try {
      const success = await userFactionDeckService.deleteUserFactionDeck(userId, factionId);
      if (!success) {
        return this.throwHttpError('Deck not found', 404);
      }

      this.setStatus(204);
      return;
    } catch (error) {
      return this.throwHttpError('Failed to delete user faction deck', 500);
    }
  }

  private toDto(deck: DBUserFactionDeck): DTOUserFactionDeck {
    return {
      _id: deck._id?.toString(),
      user_id: deck.user_id,
      faction_id: deck.faction_id,
      leader_card_id: deck.leader_card_id,
      unit_card_ids: deck.unit_card_ids,
      special_card_ids: deck.special_card_ids,
      created_at: deck.created_at?.toISOString(),
      updated_at: deck.updated_at?.toISOString(),
    };
  }

  private throwHttpError(message: string, status: number): never {
    this.setStatus(status);
    const httpError = new Error(message) as Error & { status?: number };
    httpError.status = status;
    throw httpError;
  }
}
