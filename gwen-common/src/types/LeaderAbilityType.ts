export type LeaderAbilityType =
  // NORTHERN REALMS
  | 'PLAY_FOG_FROM_DECK' // Pick an Impenetrable Fog card from your deck and play it instantly.
  | 'CLEAR_WEATHER' // Clear any weather effects (resulting from Biting Frost, Torrential Rain or Impenetrable Fog cards) in play.
  | 'SCORCH_RANGED' // Destroy your enemy's strongest Ranged Combat unit(s) if the combined strength of all his or her Ranged Combat units is 10 or more.
  | 'HORN_SIEGE' // Doubles the strength of all your Siege units (unless a Commander's Horn is also present on that row).
  | 'SCORCH_SIEGE' // Destroy your enemy's strongest Siege unit(s) if the combined strength of all his or her Siege units is 10 or more.
  // MONSTERS
  | 'DOUBLE_SPY_STRENGTH' // Doubles the strength of all spy cards (affects both players).
  | 'REVIVE_FROM_GRAVEYARD' // Restore a card from your discard pile to your hand.
  | 'HORN_MELEE' // Double the strength of all your Close Combat units (unless a Commander's Horn is also present on that row).
  | 'DISCARD_AND_DRAW' // Discard 2 cards and draw 1 card of your choice from your deck.
  | 'PLAY_WEATHER_FROM_DECK' // Pick any weather card from your deck and play it instantly.
  // SCOIATAEL
  | 'DRAW_EXTRA_CARD' // Daisy of the Valley: Draw an extra card at the beginning of the battle.
  | 'OPTIMIZE_AGILE_UNITS' // Hope of the Aen Seidhe: Move agile units to whichever valid row maximizes their strength (don't move units already in optimal row).
  | 'PLAY_FROST_FROM_DECK' // Pureblood Elf: Pick a Biting Frost card from your deck and play it instantly.
  | 'SCORCH_MELEE' // Queen of Dol Blathanna: Destroy your enemy's strongest Close Combat unit(s) if the combined strength of all his or her Close Combat units is 10 or more.
  | 'HORN_RANGED' // The Beautiful: Doubles the strength of all your Ranged Combat units (unless a Commander's Horn is also present on that row).
  // NILFGAARD
  | 'SPY_OPPONENT_HAND' // Emperor of Nilfgaard: Look at 3 random cards from your opponent's hand.
  | 'PLAY_RAIN_FROM_DECK' // His Imperial Majesty: Pick a Torrential Rain card from your deck and play it instantly.
  | 'RANDOM_REVIVE' // Invader of the North: Abilities that restore a unit to the battlefield restore a randomly-chosen unit. Affects both players.
  | 'STEAL_FROM_GRAVEYARD' // The Relentless: Draw a card from your opponent's discard pile.
  | 'CANCEL_LEADER_ABILITY'; // The White Flame: Cancel your opponent's Leader Ability.
