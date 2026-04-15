# Card Placement and Turn Management Guide

## Overview

This guide explains the turn-based card placement system and round ending logic implemented in the Gwen game engine.

## Game Flow

### Turn-Based Card Play

1. **Start Round**: Game transitions to `PLAY_CARDS` phase
2. **Player 1 Turn**: Player 1 can either:
   - Place a card on a valid row (Melee, Ranged, or Siege)
   - Pass their turn
3. **Player 2 Turn**: Same options as Player 1
4. **Round Continues**: Players alternate until both pass consecutively
5. **Round Ends**: When both players pass, round result is calculated
6. **Next Round**: If game not over, reset state and go to REDRAW phase

## Core Classes and Methods

### Game Class (`gwen-common/src/model/Game.ts`)

#### Properties
- `currentPlayerTurnUserId`: Tracks whose turn it is (null when not playing)
- `lastCardsPlayedByUserId`: Map tracking cards played by each player this round

#### Key Methods

**`startRound(): void`**
- Initializes the playing phase
- Sets Player 1 as the starting player (TODO: use coin flip)
- Resets pass status for both players
- Transitions to `PLAY_CARDS` phase

**`placeCard(userId: string, cardId: string, rowType: RangeType): void`**
- Validates it's the player's turn
- Validates card exists in player's hand
- Validates card can be placed on the target row
- Adds card to the row
- Removes card from player's hand
- Tracks the card as played
- Switches turn to opponent

**`passTurn(userId: string): void`**
- Validates it's the player's turn
- Marks player as passed
- Checks if both players have now passed
- If yes, ends the round immediately
- If no, switches turn to opponent

**`getCurrentPlayerTurnUserId(): string | null`**
- Returns ID of player whose turn it is
- Returns null if round hasn't started

**`endRound(): void`**
- Called automatically when both players pass
- Calls `determineRoundResult()` to score the round

### Player Class (`gwen-common/src/model/Player.ts`)

**`resetPass(): void`**
- Clears the passed flag
- Called at the start of each new round or when switching to PLAY_CARDS phase

**`pass(): void`**
- Sets passed flag to true

**`hasPassed(): boolean`**
- Returns whether player has passed this round

### Deck Class (`gwen-common/src/model/Deck.ts`)

**`playCard(cardId: string): void`**
- Removes a card from the player's hand by ID
- Called when a card is placed on the board
- Throws error if card not found

### PlayerRows Class (`gwen-common/src/model/PlayerRows.ts`)

**`getRowByType(rangeType: RangeType): Row`**
- Gets a specific row (Melee, Ranged, Siege) by type
- Used for card placement validation and placement

**`getAllRows(): Row[]`**
- Returns all three rows for iteration

### Row Class (`gwen-common/src/model/Row.ts`)

**`addCard(card: UnitCard): void`**
- Adds a unit card to the row
- Updates row score automatically on next `updateScore()` call

## Card Placement Rules

### Valid Placements
- **MELEE row**: Can accept cards with MELEE range or AGILE range
- **RANGED row**: Can accept cards with RANGED range or AGILE range
- **SIEGE row**: Can accept cards with SIEGE range only
- **Row Modifiers**: Can be placed on any row

### Card Range Types
```typescript
type RangeType = 'MELEE' | 'RANGED' | 'SIEGE';
type UnitsRangeType = RangeType | 'AGILE'; // AGILE can go on Melee or Ranged
```

## API Endpoints

### POST `/games/{gameId}/start-round`
- Initializes the round
- Sets up turn order
- Response: `DTOGameWithMetadata`

### POST `/games/{gameId}/place-card`
- Place a card on the board
- **Request**:
  ```typescript
  {
    playerId: string;
    cardId: string;
    rowType: 'MELEE' | 'RANGED' | 'SIEGE';
  }
  ```
- **Response**: `DTOGameWithMetadata`

### POST `/games/{gameId}/pass-turn`
- Passes the current player's turn
- **Request**:
  ```typescript
  {
    playerId: string;
  }
  ```
- **Response**: `DTOGameWithMetadata`

## Client Integration Example

```typescript
// Start a round
const startRound = async (gameId: string) => {
  const response = await api.post(`/games/${gameId}/start-round`);
  setGameState(response.data.game);
  setCurrentPlayer(response.data.game.phase === 'PLAY_CARDS' ? response.data.game.currentPlayer : null);
};

// Place a card
const placeCard = async (gameId: string, playerId: string, cardId: string, rowType: RangeType) => {
  try {
    const response = await api.post(`/games/${gameId}/place-card`, {
      playerId,
      cardId,
      rowType,
    });
    setGameState(response.data.game);
    // Check if round ended (both players passed)
    if (response.data.game.lastRoundResult) {
      // Show end-round overlay
      showRoundEndScreen(response.data.game.lastRoundResult);
    }
  } catch (error) {
    // Handle validation error (card not in hand, not player's turn, etc.)
    showError(error.message);
  }
};

// Pass turn
const passTurn = async (gameId: string, playerId: string) => {
  try {
    const response = await api.post(`/games/${gameId}/pass-turn`, { playerId });
    setGameState(response.data.game);
    // Check if round just ended
    if (response.data.game.lastRoundResult) {
      showRoundEndScreen(response.data.game.lastRoundResult);
    }
  } catch (error) {
    showError(error.message);
  }
};
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `"Cannot place card during phase: {phase}"` | Wrong game phase | Only place cards during PLAY_CARDS |
| `"Not your turn"` | Player trying to play out of turn | Wait for current turn to complete |
| `"Card {id} not found in hand"` | Card doesn't exist in player's hand | Verify card ID and player state |
| `"Card {id} cannot be placed on {row}"` | Card range doesn't match row type | Check card's range property |
| `"Cannot pass during phase: {phase}"` | Wrong game phase | Only pass during PLAY_CARDS |

## Round Completion Logic

### When a Round Ends
1. Both players have passed consecutively
2. `passTurn()` detects both passed and calls `endRound()`
3. `determineRoundResult()` is called automatically
4. Scores are calculated from each row
5. Winner of the round is determined
6. If first to 2 rounds won: game ends with `determineGameResult()`
7. If game continues: `resetRoundState()` clears the board, keeps hands

### State After Round End
- `currentPlayerTurnUserId` is set to null
- Both players' pass flags are cleared
- Board is cleared (rows are new empty rows)
- Player hands are kept intact
- Game transitions to REDRAW or END phase

## Turn Switching Logic

After each card placement, the turn automatically switches to the opponent:
1. Player A places card → turn = Player B
2. Player B places card → turn = Player A
3. Continue until both pass

## Phase Transitions

```
WAITING_FOR_PLAYERS
        ↓
    FLIP_COIN
        ↓
    PLAY_CARDS (cards placed here, turns alternate)
        ↓
    (Both players pass)
        ↓
    Round End Calculation
        ↓
    REDRAW (or END if game won)
        ↓
    Next Round (if game continues)
```

## Future Enhancements

- [ ] Implement coin flip to determine starting player
- [ ] Add card redraw/mulligan logic during REDRAW phase
- [ ] Implement row modifier card abilities
- [ ] Add hero card special rules (can't be resurrected, permanent strength)
- [ ] Implement unit card abilities (spies, resurrections, etc.)
- [ ] Add weather effects
- [ ] Implement Elo rating changes based on game result
