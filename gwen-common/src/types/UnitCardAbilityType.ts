export type UnitCardAbilityType =
  | 'AGILE' // Can be placed on the melee or distance row
  | 'MEDIC' // Resurrects a card from the discard pile
  | 'MORAL_BOOST' // Gain +1 power for each card in the same row (excluding itself)
  | 'MUSTER' // Place all the cards with the same name from your deck onto the battlefield
  | 'SPY' // Placed in the opponent's row, draws 2 cards from the deck
  | 'TIGHT_BOND' // Multiplies the power of all cards with the same name in the same row (2,3,4, etc...)
  | 'ROW_BOOST'
  | 'DECAY' // Select a card in the battlefied, replace it the the decay card, put the replaced card in the hand
  | 'COMMANDER_HORN' // Doubles the power of all cards in the same row
  | 'SCORCH'; // Destroys the strongest cards on the battlefield.
// | 'SUMMON_AVENGER' // Summon a card when discarded. (Card defined in the config)
