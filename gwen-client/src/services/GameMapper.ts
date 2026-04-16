import type { DTOGameWithMetadataGame } from 'gwen-generated-api';
import { Deck, Game, GwenConfig, Player, PlayerRows, RowModifierCard } from 'gwen-common';

export abstract class GameMapper {
  static toModel(dto: DTOGameWithMetadataGame): Game {
    // Map players from DTO to domain model
    const player1 = this.mapPlayer(dto.player1 as any);
    const player2 = this.mapPlayer(dto.player2 as any);

    const game = new Game(player1, player2);

    // Map player rows from DTO
    const player1Rows = this.mapPlayerRows(dto.player1Rows as any);
    const player2Rows = this.mapPlayerRows(dto.player2Rows as any);

    game.setPlayer1Rows(player1Rows);
    game.setPlayer2Rows(player2Rows);

    // Restore round result if present
    const lastRoundResult = (dto as any)?.lastRoundResult;
    if (lastRoundResult) {
      const p1Id = player1.getUserId();
      const p2Id = player2.getUserId();
      const winnerId =
        lastRoundResult.player1_result === 'WIN'
          ? p1Id
          : lastRoundResult.player2_result === 'WIN'
            ? p2Id
            : null;
      game.restoreRoundResult(
        p1Id,
        lastRoundResult.player1_result,
        p2Id,
        lastRoundResult.player2_result,
        winnerId,
      );
    }

    // Restore game end result if present
    const gameEndResult = (dto as any)?.gameEndResult;
    if (gameEndResult) {
      const p1Id = player1.getUserId();
      const p2Id = player2.getUserId();
      game.restoreGameResult(p1Id, gameEndResult.player1_result, p2Id, gameEndResult.player2_result);
    }

    return game;
  }

  private static mapPlayer(dtoPlayer: any): Player {
    console.log({ dtoPlayer });
    const cardIndex = GwenConfig.getCurrentDatapackCardIndex();

    const dtoDeck = dtoPlayer.deck as any | undefined;

    // Resolve leader card id from the DTO
    const factionId = dtoDeck?.factionId as string;
    const leaderIdFromDeck = dtoDeck?.leader?.id as string | undefined;
    const leaderIdFromPlayer =
      typeof dtoPlayer.leaderId === 'string' ? dtoPlayer.leaderId : undefined;
    const leaderIdFromCompressed = typeof dtoPlayer.c === 'string' ? dtoPlayer.c : undefined;

    const leaderId = leaderIdFromDeck ?? leaderIdFromPlayer ?? leaderIdFromCompressed;

    if (!leaderId) {
      throw new Error('Unable to resolve leader id from DTO player');
    }

    // Find corresponding LeaderCard instance in the shared datapack index
    const leaderCard = cardIndex.findLeaderCardById(leaderId);

    // Rebuild deck from card ids using the shared datapack index
    const deck = new Deck(factionId, leaderCard);

    const mapCards = (cards: any[] | undefined) => {
      if (!Array.isArray(cards)) return [];
      return cards
        .map((raw) => {
          const id = (raw as any)?.id as string | undefined;
          if (!id) return null;
          try {
            return cardIndex.findPlayableCardById(id);
          } catch {
            // If a card is not found in the index, just ignore it on the client
            return null;
          }
        })
        .filter((c): c is ReturnType<typeof cardIndex.findPlayableCardById> => c !== null);
    };

    // Draw pile
    const drawPileCards = mapCards(dtoDeck?.drawPile);
    if (drawPileCards.length > 0) {
      deck.setDrawPile(drawPileCards);
    }

    // Hand
    const handCards = mapCards(dtoDeck?.hand);
    if (handCards.length > 0) {
      // addAllToHands is typed for UnitCard[], but all playable cards share the same interface here
      deck.addAllToHands(handCards as any);
    }

    // Discarded pile is currently not exposed via a setter on Deck, so we ignore it for now.

    // Create base Player with userId
    const player = new Player(String(dtoPlayer.userId), deck);

    // Restore gem count from DTO
    if (typeof dtoPlayer.gems === 'number') {
      player.setGems(dtoPlayer.gems);
    }

    // Restore "passed" state if needed
    if (dtoPlayer.passed) {
      player.pass();
    }

    return player;
  }

  private static mapPlayerRows(dtoPlayerRows: any): PlayerRows {
    // Extract userId from the DTO PlayerRows object
    const userId = dtoPlayerRows?.userId as string;

    if (!userId) {
      throw new Error('Unable to extract userId from DTO PlayerRows');
    }

    // Create a new PlayerRows instance
    const playerRows = new PlayerRows(userId);
    const cardIndex = GwenConfig.getCurrentDatapackCardIndex();

    // If there are rows in the DTO, populate them with cards
    if (dtoPlayerRows?.rows && Array.isArray(dtoPlayerRows.rows)) {
      const dtoRows = dtoPlayerRows.rows;

      dtoRows.forEach((dtoRow: any, index: number) => {
        if (index >= 3) return; // Only MELEE, RANGED, SIEGE (3 rows)

        const row = playerRows.getRows()[index]; // Get the row at this index

        // Add unit cards to the row
        if (dtoRow?.cards && Array.isArray(dtoRow.cards)) {
          dtoRow.cards.forEach((cardData: any) => {
            try {
              const id = cardData?.id as string | undefined;
              if (id) {
                const card = cardIndex.findPlayableCardById(id);
                row.addCard(card as any);
              }
            } catch {
              // If a card is not found in the index, just ignore it on the client
            }
          });
        }

        // Add modifier card if present
        if (dtoRow?.modifierCard) {
          try {
            const modifierConfig = dtoRow.modifierCard;
            if (modifierConfig?.name && modifierConfig?.strategy) {
              const modifierCard = new RowModifierCard({
                name: modifierConfig.name,
                strategy: modifierConfig.strategy,
              });
              row.setModifierCard(modifierCard);
            }
          } catch {
            // Silently ignore if modifier card cannot be reconstructed
          }
        }
      });
    }

    // Update the score after populating rows
    playerRows.updateScore();

    return playerRows;
  }
}
