import { Hand } from 'pokersolver';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['h', 'd', 'c', 's'];

function buildFullDeck() {
  const deck = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push(rank + suit);
    }
  }
  return deck;
}

function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function simulate({ holeCards, communityCards, playerCount, iterations = 50000 }) {
  const knownCards = [...holeCards, ...communityCards];
  const remainingDeck = buildFullDeck().filter(c => !knownCards.includes(c));

  let wins = 0;
  let ties = 0;
  let losses = 0;

  for (let i = 0; i < iterations; i++) {
    const shuffled = shuffle(remainingDeck);
    let idx = 0;

    const board = [...communityCards];
    while (board.length < 5) {
      board.push(shuffled[idx++]);
    }

    const opponentHands = [];
    for (let p = 0; p < playerCount - 1; p++) {
      opponentHands.push([shuffled[idx++], shuffled[idx++]]);
    }

    const myHand = Hand.solve([...holeCards, ...board]);

    const oppHands = opponentHands.map(cards => Hand.solve([...cards, ...board]));

    const allHands = [myHand, ...oppHands];
    const winners = Hand.winners(allHands);

    if (winners.length === 1 && winners[0] === myHand) {
      wins++;
    } else if (winners.includes(myHand)) {
      ties++;
    } else {
      losses++;
    }
  }

  return {
    wins: ((wins / iterations) * 100).toFixed(1),
    ties: ((ties / iterations) * 100).toFixed(1),
    losses: ((losses / iterations) * 100).toFixed(1),
  };
}

// Listen for messages from the main thread
self.onmessage = function (e) {
  const result = simulate(e.data);
  self.postMessage(result);
};