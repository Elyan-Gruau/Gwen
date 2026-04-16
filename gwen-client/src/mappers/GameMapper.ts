import type { DTOGameWithMetadataGame, DTOPlayableCard, DTOPlayer } from 'gwen-generated-api';

import { Deck, Game, GwenConfig, Player, PlayerRows, RowModifierCard } from 'gwen-common';

export class GameMapper {
  static toModel(dto: DTOGameWithMetadataGame): Game {
    const player1 = this.mapPlayer(dto.player1);
    const player2 = this.mapPlayer(dto.player2);
    const game = new Game(player1, player2);
    const player1Rows = this.mapPlayerRows(dto.player1Rows as any);
    const player2Rows = this.mapPlayerRows(dto.player2Rows as any);
    game.setPlayer1Rows(player1Rows);
    game.setPlayer2Rows(player2Rows);
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
    const gameEndResult = (dto as any)?.gameEndResult;
    if (gameEndResult) {
      const p1Id = player1.getUserId();
      const p2Id = player2.getUserId();
      game.restoreGameResult(
        p1Id,
        gameEndResult.player1_result,
        p2Id,
        gameEndResult.player2_result,
      );
    }
    return game;
  }

  static mapPlayer(dtoPlayer: DTOPlayer): Player {
    const cardIndex = GwenConfig.getCurrentDatapackCardIndex();
    const dtoDeck = dtoPlayer.deck;
    const factionId = dtoDeck?.factionId as string;
    const leaderId = dtoDeck?.leader?.id;
    if (!leaderId) {
      throw new Error('Unable to resolve leader id from DTO deck');
    }
    const leaderCard = cardIndex.findLeaderCardById(leaderId);
    const deck = new Deck(factionId, leaderCard);
    const mapCards = (cards: DTOPlayableCard[] | undefined) => {
      if (!Array.isArray(cards)) return [];
      return cards
        .map((raw) => {
          const id = raw?.id as string | undefined;
          if (!id) return null;
          try {
            return cardIndex.findPlayableCardById(id);
          } catch {
            return null;
          }
        })
        .filter((c): c is ReturnType<typeof cardIndex.findPlayableCardById> => c !== null);
    };
    const drawPileCards = mapCards(dtoDeck?.drawPile);
    if (drawPileCards.length > 0) {
      deck.setDrawPile(drawPileCards);
    }
    const handCards = mapCards(dtoDeck?.hand);
    if (handCards.length > 0) {
      deck.addAllToHands(handCards as any);
    }
    const discardedCards = mapCards(dtoDeck?.discardPile);
    if (discardedCards.length > 0) {
      deck.setDiscarded(discardedCards);
    }
    const player = new Player(String(dtoPlayer.userId), deck);
    if (typeof dtoPlayer.gems === 'number') {
      player.setGems(dtoPlayer.gems);
    }
    if (dtoPlayer.passed) {
      player.pass();
    }
    return player;
  }

  static mapPlayerRows(dtoPlayerRows: any): PlayerRows {
    const userId = dtoPlayerRows?.userId as string;
    if (!userId) {
      throw new Error('Unable to extract userId from DTO PlayerRows');
    }
    const playerRows = new PlayerRows(userId);
    const cardIndex = GwenConfig.getCurrentDatapackCardIndex();
    if (dtoPlayerRows?.rows && Array.isArray(dtoPlayerRows.rows)) {
      const dtoRows = dtoPlayerRows.rows;
      dtoRows.forEach((dtoRow: any, index: number) => {
        if (index >= 3) return;
        const row = playerRows.getRows()[index];
        if (dtoRow?.cards && Array.isArray(dtoRow.cards)) {
          dtoRow.cards.forEach((cardData: any) => {
            try {
              const id = cardData?.id as string | undefined;
              if (id) {
                const card = cardIndex.findPlayableCardById(id);
                row.addCard(card as any);
              }
            } catch {}
          });
        }
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
          } catch {}
        }
      });
    }
    playerRows.updateScore();
    return playerRows;
  }
}
