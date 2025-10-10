// Featured games to display in carousels - using ILIKE-style pattern matching
// These patterns work like SQL: LOWER(name) ILIKE '%pattern%'
export const FEATURED_GAMES = {
  'evolution': [
    'crazy time',
    'monopoly live',
    'monopoly big baller',
    'dream catcher',
    'mega ball',
    'lightning roulette',
    'lightning baccarat',
    'lightning dice',
    'gonzo', // Matches "Gonzo's Treasure Map", etc.
    'deal or no deal',
    'infinite blackjack',
    'speed baccarat',
    'football studio',
    'super sic bo',
    'side bets city',
  ],
  'ezugi': [
    'andar bahar',
    'teen patti',
    'lucky 7',
    'live roulette',
    'live blackjack',
    'baccarat',
    'dragon tiger',
    'sic bo',
    '32 cards live',
    'casino hold', // Matches "Casino Hold'em"
    'keno',
    'cricket war',
  ],
  'jili': [
    'golden empire',
    'super ace',
    'money coming',
    'crazy 777',
    'fortune gems',
    'boxing king',
    'charge buffalo',
    'monkey king',
    'dragon treasure',
    'money tree',
    'crazy hunter',
    'ali baba',
    'pharaoh treasure',
  ],
} as const;

