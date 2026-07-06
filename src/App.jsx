import { useState, useRef } from 'react';
import CardPicker from './components/CardPicker';
import PlayerSelector from './components/PlayerSelector';
import Results from './components/Results';

function App() {
  const [holeCards, setHoleCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(2);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef(null);

  const usedCards = [...holeCards, ...communityCards];

  const calculate = () => {
    if (holeCards.length < 2) {
      alert('Please select exactly 2 hole cards first!');
      return;
    }

    setIsCalculating(true);
    setResults(null);

    // Create a new Web Worker
    workerRef.current = new Worker(
      new URL('./workers/poker.worker.js', import.meta.url),
      { type: 'module' }
    );

    // Send data to worker
    workerRef.current.postMessage({
      holeCards,
      communityCards,
      playerCount,
      iterations: 50000,
    });

    // Receive results from worker
    workerRef.current.onmessage = (e) => {
      setResults(e.data);
      setIsCalculating(false);
      workerRef.current.terminate();
    };
  };

  const reset = () => {
    setHoleCards([]);
    setCommunityCards([]);
    setPlayerCount(2);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
        🃏 Poker Calculator
      </h1>

      <div className="w-full px-6 flex gap-12 items-start justify-center">
        <CardPicker
          label="Your Hole Cards (pick 2)"
          selected={holeCards}
          onChange={setHoleCards}
          usedCards={usedCards}
          maxCards={2}
        />
        <CardPicker
          label="Community Cards (pick up to 5)"
          selected={communityCards}
          onChange={setCommunityCards}
          usedCards={usedCards}
          maxCards={5}
        />
      </div>

      <div className="w-full px-6 mt-4 flex justify-center">
        <div className="w-full max-w-2xl">
          <PlayerSelector
            playerCount={playerCount}
            onChange={setPlayerCount}
          />

          {/* Action buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={calculate}
              disabled={isCalculating}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-lg transition"
            >
              {isCalculating ? 'Calculating...' : '🎲 Calculate Odds'}
            </button>
            <button
              onClick={reset}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl text-lg transition"
            >
              🔄 Reset
            </button>
          </div>

          <Results results={results} isCalculating={isCalculating} />
        </div>
      </div>
    </div>
  );
}

export default App;