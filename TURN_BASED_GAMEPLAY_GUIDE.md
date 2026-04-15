# Turn-Based Gameplay Implementation Guide

## Overview

The Gwen game now has a complete turn-based card placement system. Players take turns placing cards on rows, and when both pass, the round ends automatically with scoring.

## Game Flow

### Turn Sequence

1. **Your Turn Indicator** - See "⭐ Your Turn" at the top with a pulsing animation
2. **Select Card** - Click a card in your hand to select it
3. **Select Row** - Click on the Melee, Ranged, or Siege row where you want to place the card
   - Rows highlight on hover when a card is selected
   - Gold glow appears to indicate placement target
4. **Card Placed** - Card moves from hand to board, visual confirmation
5. **Turn Switches** - Opponent's turn begins automatically
6. **Opponent Plays** - Opponent places a card or passes
7. **Your Turn Returns** - When opponent passes or plays
8. **Pass Turn** - Click "Pass Turn" button to skip your turn
9. **Round Ends** - When both players pass consecutively, round ends automatically

### State Management

```
GamePage (polling every 1s)
├── stores: selectedCardId, game metadata
├── refetches: useGetGameWithMetadataById (1s interval)
└── GameView
    ├── stores: turn indicator state
    ├── mutations: usePlaceCard, usePassTurn
    ├── UserGame (opponent board)
    │   └── UserBoard (handles row clicks)
    ├── UserGame (your board)
    │   └── UserBoard (handles row clicks)
    └── PlayerHand (card selection)
```

## Key Components

### GamePage.tsx

**Responsibilities:**
- Poll game state every 1 second via `useGetGameWithMetadataById`
- Manage selected card state
- Clear selected card when it's not your turn
- Pass game metadata, callbacks to GameView

**State:**
```typescript
const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
const { data: game, refetch } = useGetGameWithMetadataById(gameId, {
  query: { refetchInterval: 1000 }
});
```

### GameView.tsx

**Responsibilities:**
- Display whose turn it is with visual indicator
- Handle card selection from hand
- Handle row clicks for card placement
- Handle pass turn action
- Manage loading states for mutations

**Key Methods:**
- `handleCardSelect(card)` - Called when player clicks a card in hand
- `handleRowClick(rowType)` - Called when player clicks a row to place card
- `handlePassTurn()` - Called when player clicks "Pass Turn" button

**Turn Indicator UI:**
```
[⭐ Your Turn]  [Pass Turn Button]
or
[⏳ Opponent's Turn]
```

### UserGame.tsx & UserBoard.tsx

**Responsibilities:**
- Render opponent and player boards
- Accept row click callbacks
- Apply visual effects when placing cards (highlighting, glow)

**Visual Effects:**
- When `isPlacingCard=true`:
  - Rows become clickable (cursor: pointer)
  - Hover effect: gold glow, slight scale up
  - Non-hover: normal state

## Card Placement Rules

### Validation (Server-Side)

The server validates:
1. **Turn Validation**: Only current player can place card
2. **Card Exists**: Card ID must be in player's hand
3. **Row Compatibility**: 
   - MELEE range → MELEE or AGILE row
   - RANGED range → RANGED or AGILE row  
   - SIEGE range → SIEGE row only

### Client-Side Flow

1. Player clicks card in hand
2. `setSelectedCardId(cardId)` - Card is highlighted
3. `setIsPlacingCard(true)` - Board rows become interactive
4. Player clicks row
5. Send request: `placeCard({ gameId, data: { playerId, cardId, rowType } })`
6. Server responds with updated game state
7. Game state auto-updates via polling
8. UI reflects changes (card gone from hand, appears on board, turn switched)

## API Integration

### Generated Hooks (from gwen-generated-api)

```typescript
// Place a card on the board
const placeCardMutation = usePlaceCard();
await placeCardMutation.mutateAsync({
  gameId: string;
  data: {
    playerId: string;
    cardId: string;
    rowType: 'MELEE' | 'RANGED' | 'SIEGE';
  }
});

// Pass the current turn
const passTurnMutation = usePassTurn();
await passTurnMutation.mutateAsync({
  gameId: string;
  data: {
    playerId: string;
  }
});
```

## Error Handling

### User Feedback

**Card Placement Errors:**
```
"Cannot place card during phase: {phase}"
→ Wrong game phase (only works in PLAY_CARDS phase)

"Not your turn"
→ Player tried to play out of turn

"Card {id} not found in hand"
→ Card doesn't exist or was already played

"Card {id} cannot be placed on {row}"
→ Card's range doesn't match row type
```

**Turn Pass Errors:**
```
"Cannot pass during phase: {phase}"
→ Only works in PLAY_CARDS phase
```

### Client-Side Handling

All mutations wrap in try-catch:
```typescript
try {
  await placeCardMutation.mutateAsync(...);
  refetchGame();
} catch (error) {
  console.error('Failed to place card:', error);
  // UI shows error (TODO: add toast notification)
}
```

## UI/UX Features

### Visual Feedback

1. **Turn Indicator**
   - Green pulsing text: "⭐ Your Turn"
   - Yellow text: "⏳ Opponent's Turn"
   - Pass button visible and enabled only on your turn

2. **Card Selection**
   - Selected card has highlight border
   - Can be selected via click or keyboard (arrow keys + Enter)

3. **Board Interaction**
   - Rows glow on hover when placing card
   - Cursor changes to pointer
   - Slight scale effect for visual feedback

4. **Button States**
   - Pass button disabled during opponent's turn
   - Pass button shows "Passing..." while request in flight
   - Card placement disabled while mutation pending

### Keyboard Support

- **Arrow Left/Right** - Navigate cards in hand
- **Enter** - Confirm selected card
- Click row to place

## Game Loop Example

```typescript
// 1. Game starts, poll begins
useEffect(() => {
  // GamePage polls every 1s
  const { data: game } = useGetGameWithMetadataById(gameId, {
    query: { refetchInterval: 1000 }
  });
}, []);

// 2. Player sees "Your Turn" indicator
if (game.currentPlayerTurnUserId === userId) {
  return <div>⭐ Your Turn</div>;
}

// 3. Player clicks card
<PlayerHand onCardConfirm={(card) => {
  setSelectedCardId(card.getId());
  // Rows now become interactive
}} />

// 4. Player clicks row
<UserBoard onRowClick={async (rowType) => {
  await placeCardMutation.mutateAsync({
    gameId,
    data: { playerId: userId, cardId: selectedCardId, rowType }
  });
  // Mutation complete, polling fetches new state
  // Turn switches automatically on server
  // Next poll shows opponent's turn
}} />

// 5. Polling detects new state, UI updates
// Game shows opponent's turn, rows no longer interactive
```

## Performance Considerations

### Polling Interval
- **1 second**: Provides responsive feel (100ms latency acceptable for turn-based)
- **Configurable**: Can adjust in `RefetchInterval` option if needed

### Optimization Opportunities
- [ ] Debounce rapid card placements
- [ ] Cache game state locally while polling
- [ ] Implement real-time updates with WebSocket
- [ ] Add optimistic updates (place card locally before server confirms)

## Future Enhancements

- [ ] Implement coin flip to determine starting player
- [ ] Add card redraw/mulligan UI during REDRAW phase
- [ ] Show played cards history
- [ ] Add undo/take-back card (first 3 seconds only)
- [ ] Implement card abilities that trigger on placement
- [ ] Add sound effects for card placement and turn switch
- [ ] Implement AI opponent for single-player mode
- [ ] Add timeout penalties for slow players (30s per turn)
- [ ] Implement tournament mode with multiple games

## Testing

### Manual Test Flow

1. **Start game with 2 players**
   - Player 1 sees "Your Turn"
   - Player 2 sees "Opponent's Turn"

2. **Player 1 Places Card**
   - Click card in hand
   - Click row to place
   - Card disappears from hand, appears on board
   - UI switches to "Opponent's Turn"
   - Polling fetches new state (1s)

3. **Player 2 Creates Second Game Instance**
   - Open same gameId in second browser
   - Should see "Your Turn"
   - Can place cards immediately

4. **Both Players Pass**
   - After both click "Pass Turn"
   - Round ends automatically
   - EndPhase overlay appears (3 sec)
   - Game transitions to next round or END

### Debug Commands

```typescript
// In browser console on game page
// Check current turn
console.log(game.game.currentPlayerTurnUserId);

// Check selected card
console.log(selectedCardId);

// Manually refetch
refetchGame();
```

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill Node processes
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
# Restart server
npm run dev
```

### Cards not updating on board
1. Check browser console for API errors
2. Verify game state polling interval (should be 1s)
3. Check server logs for validation errors
4. Ensure `refetchGame()` is called after mutations

### Can't click rows to place cards
1. Verify `isPlacingCard` state is true
2. Check `selectedCardId` is set
3. Ensure it's your turn (check `currentPlayerTurnUserId`)
4. Look for error message in console

### Turn doesn't switch after card placement
1. Verify server mutation succeeded (check network tab)
2. Manually trigger refetch: `refetchGame()`
3. Check server logs for game state issues
4. Verify polling is active (useGetGameWithMetadataById with refetchInterval)
