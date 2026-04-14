/**
 * EndPhase Integration Guide - Complete End-to-End Flow
 * 
 * This guide explains how Round End and Game End work together with the server,
 * covering both backend logic and frontend UI display.
 */

## Server-Side Round & Game End Logic

### Game State Tracking

The `Game` model on the server tracks:
- `currentRound`: Which round (1, 2, or 3)
- `roundsWonBy`: Map of each player's round wins (first to 2 wins the game)
- `lastRoundResult`: Result of the most recently completed round (WIN/LOSS/DRAW per player)
- `gameResult`: Final result when game ends (null until game is over)
- `phase`: Current game phase (WAITING_FOR_PLAYERS, PLAY_CARDS, REDRAW, END)

### Round End Detection

When both players have passed their turns:
1. **Server calculates round scores** via `game.determineRoundResult()`
   - Sums card power in each row for both players
   - Compares totals to determine winner (or DRAW)
   - Awards 1 round win to the winner
   - Stores result in `lastRoundResult` for each player

2. **Check if game should end** (first to 2 round wins)
   - If yes: Calls `determineGameResult()` → transitions to END phase
   - If no: Transitions to REDRAW phase for next round setup

3. **Client receives updated game state** via `GET /games/{gameId}/active`
   - Contains `lastRoundResult` with round scores and outcomes
   - Contains `gameEndResult` if game has ended (null otherwise)

### New Endpoint

```typescript
POST /games/{gameId}/end-round
```
Call this when both players have passed in PLAY_CARDS phase.
Triggers round score calculation and game state advancement.

Returns full `DTOGameWithMetadata` including:
- `lastRoundResult`: Round scores, results, standings
- `gameEndResult`: Final game result (null if game continues)

### DTO Structures

#### DTORoundEndResult (shown during 3-second overlay)
```typescript
{
  round: 1,
  player1_result: 'WIN',      // From player1's perspective
  player2_result: 'LOSS',      // From player2's perspective
  player1_score: 45,
  player2_score: 32,
  player1_rounds_won: 1,
  player2_rounds_won: 0,
}
```

#### DTOGameEndResult (persistent page)
```typescript
{
  player1_id: 'user-123',
  player2_id: 'user-456',
  player1_result: 'WIN',
  player2_result: 'LOSS',
  player1_rounds_won: 2,
  player2_rounds_won: 0,
  winner_id: 'user-123',
  player1_elo_change: 25,   // TODO: Calculated when Elo system ready
  player2_elo_change: -15,   // TODO: Calculated when Elo system ready
}
```

---

## Client-Side Flow

### Step 1: Detect Round End

Listen for when both players have passed:

```typescript
const gameState = gameData?.game;

const shouldEndRound = gameState?.players.every(p => p.passed);

if (shouldEndRound) {
  // Call server to calculate round results
  await endRound({ gameId });  // POST /games/{gameId}/end-round
}
```

### Step 2: Show Round End Overlay (3 seconds)

After calling `end-round`, the response includes `lastRoundResult`:

```typescript
{
  mode="roundEnd"
  result={response.game.lastRoundResult.player1_result}  // WIN/LOSS/DRAW
  roundEndDuration={3000}
  onRoundEndComplete={handleRoundEndComplete}
}
```

This overlay shows:
- "YOU WIN" / "YOU LOST" / "DRAW"
- Round score comparison
- Standings (e.g., "Round 1 of 3: You 1 - Opponent 0")
- Auto-hides after 3 seconds, then continues game

### Step 3: Transition to Next Round or Game End

After round end overlay closes:

```typescript
const handleRoundEndComplete = () => {
  const gameState = gameData?.game;
  
  if (gameState?.gameEndResult) {
    // Game has ended - show persistent page
    setShowGameEnd(true);
  } else {
    // Game continues - transition to REDRAW phase
    setPhase('REDRAW');
    // TODO: Handle mulligan/redraw UI
  }
};
```

### Step 4: Show Game End Page (Persistent)

When `gameEndResult` is not null, the game has ended:

```typescript
{
  mode="gameEnd"
  result={gameState.gameEndResult.player1_result}  // WIN/LOSS/DRAW
  opponentName={opponentName}
  eloChange={gameState.gameEndResult.player1_elo_change}
}
```

This page shows:
- "YOU WIN" / "YOU LOST" with styling
- Final standings (e.g., "You 2 - Opponent 0")
- Opponent name
- ELO gained/lost (when Elo system ready)
- **Buttons:**
  - "Main Menu" → `useNavigate()` back to home
  - "Next Match" → Calls `rematch()` or searches matchmaking queue

---

## Complete Component Integration

```typescript
import { useGetGameWithMetadataById, usePostGamesEndRound } from 'gwen-generated-api';
import EndPhase from '../game-phases/end-phase/EndPhase';
import { useState, useEffect } from 'react';

export const GameView = ({ gameId }: { gameId: string }) => {
  const { data: gameData, refetch } = useGetGameWithMetadataById(gameId);
  const { mutate: endRound } = usePostGamesEndRound();
  
  const [showRoundEnd, setShowRoundEnd] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);

  const gameState = gameData?.game;
  const bothPassed = gameState?.players.every(p => p.passed);

  // Detect round end
  useEffect(() => {
    if (bothPassed && !showRoundEnd && gameState?.phase === 'PLAY_CARDS') {
      // Trigger round end calculation on server
      endRound(
        { gameId },
        {
          onSuccess: (response) => {
            setShowRoundEnd(true);
            // Refetch game state to get latest round result
            refetch();
          },
        }
      );
    }
  }, [bothPassed, gameState?.phase, showRoundEnd]);

  // Handle round end overlay close
  const handleRoundEndComplete = () => {
    setShowRoundEnd(false);
    
    // Check if game ended or continue to next round
    if (gameState?.gameEndResult) {
      setShowGameEnd(true);
    } else {
      // Next round: transition to REDRAW phase
      // TODO: Implement mulligan UI
    }
  };

  // Render overlay or persistent page
  return (
    <>
      {showRoundEnd && gameState?.lastRoundResult && (
        <EndPhase
          mode="roundEnd"
          result={
            gameState.lastRoundResult[getCurrentUserId()]  // Get current player's result
          }
          roundEndDuration={3000}
          onRoundEndComplete={handleRoundEndComplete}
        />
      )}

      {showGameEnd && gameState?.gameEndResult && (
        <EndPhase
          mode="gameEnd"
          result={gameState.gameEndResult[getCurrentUserId()]}
          opponentName={getOpponentName()}
          eloChange={gameState.gameEndResult.player1_elo_change}
        />
      )}

      {!showGameEnd && <GameBoard />}
    </>
  );
};
```

---

## Important Notes

### TODO Items (Card Logic Not Yet Implemented)

The following need implementation before full gameplay:

1. **Card Placement Logic**
   - `placeCard()` endpoint validates card can be placed on row
   - Updates card positions and power calculations
   - When ready: Integrate with `determineRoundResult()`

2. **Redraw Phase**
   - After round ends, player can mulligan (redraw) cards
   - Need to implement card draw logic in `Game.resetRoundState()`

3. **ELO System**
   - `player1_elo_change` currently `undefined`
   - Will be calculated based on player ratings and game result
   - Persist ELO to database after game ends

4. **Persistence**
   - Currently game state lives only in `GameManager` memory
   - Need to serialize/deserialize game state to database
   - Implement reconnection logic if player disconnects

### Current Scoped Test Flow

To test round/game end without full card logic:

1. Both players manually pass turns repeatedly
2. After second pass → `end-round` triggers
3. Round calculation runs (currently all cards have power 0)
4. After 2 rounds → Game ends
5. See game end result page

### Gwent Rules Reference

From README:
- **2 players, best of 3 rounds**
- **3 rows**: Melee, Ranged, Siege
- **Each player plays 1 card per turn** (when card placement ready)
- **Round winner**: Highest total power across all rows
- **Round ends**: Both players pass or no cards left to play
- **Game winner**: First to win 2 rounds

---

## Files Modified

- `gwen-common/src/types/GameResultType.ts` - GameResult enum (WIN/LOSS/DRAW)
- `gwen-common/src/model/Game.ts` - Round/game tracking & result logic
- `gwen-server/src/features/game/dtos/DTOGame.ts` - Result DTOs
- `gwen-server/src/features/game/controllers/GameController.ts` - `end-round` endpoint
- `gwen-client/src/components/game-phases/end-phase/EndPhase.tsx` - Overlay/page component
- `gwen-client/src/components/game-phases/end-phase/INTEGRATION_GUIDE.md` - This guide

