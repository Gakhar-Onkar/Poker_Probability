import { useState, useRef } from 'react';
import CardPicker from './components/CardPicker';
import PlayerSelector from './components/PlayerSelector';
import Results from './components/Results';
import CameraDetector from './components/CameraDetector';

function App() {
  const [holeCards, setHoleCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(2);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [holeCameraMode, setHoleCameraMode] = useState(false);
  const [communityCameraMode, setCommunityCameraMode] = useState(false);
  const workerRef = useRef(null);

  const usedCards = [...holeCards, ...communityCards];

  const calculate = () => {
    if (holeCards.length < 2) {
      alert('Please select exactly 2 hole cards first!');
      return;
    }
    setIsCalculating(true);
    setResults(null);

    workerRef.current = new Worker(
      new URL('./workers/poker.worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.postMessage({
      holeCards,
      communityCards,
      playerCount,
      iterations: 50000,
    });

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
    setHoleCameraMode(false);
    setCommunityCameraMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
        🃏 Poker Calculator
      </h1>

      <div className="flex flex-col items-center gap-6 px-6">

        {/* Row 1 — Two columns side by side */}
        <div className="flex flex-row gap-6 w-full items-start" style={{ maxWidth: '50rem' }}>

          {/* Left — Hole Cards */}
          <div className="flex-1 flex flex-col gap-3">

            {/* Hole cards toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setHoleCameraMode(false)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
                  !holeCameraMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ⌨️ Manual
              </button>
              <button
                onClick={() => setHoleCameraMode(true)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
                  holeCameraMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                📷 Camera
              </button>
            </div>

            {holeCameraMode ? (
              <CameraDetector
                onCardsDetected={(cards) => {
                  const combined = [...new Set([...holeCards, ...cards])];
                  setHoleCards(combined.slice(0, 2));
                }}
                usedCards={usedCards}
              />
            ) : (
              <CardPicker
                label="Your Hole Cards (pick 2)"
                selected={holeCards}
                onChange={setHoleCards}
                usedCards={usedCards}
                maxCards={2}
              />
            )}
          </div>

          {/* Right — Community Cards */}
          <div className="flex-1 flex flex-col gap-3">

            {/* Community cards toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setCommunityCameraMode(false)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
                  !communityCameraMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ⌨️ Manual
              </button>
              <button
                onClick={() => setCommunityCameraMode(true)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
                  communityCameraMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                📷 Camera
              </button>
            </div>

            {communityCameraMode ? (
              <CameraDetector
                onCardsDetected={(cards) => {
                  const combined = [...new Set([...communityCards, ...cards])];
                  setCommunityCards(combined.slice(0, 5));
                }}
                usedCards={usedCards}
              />
            ) : (
              <CardPicker
                label="Community Cards (pick up to 5)"
                selected={communityCards}
                onChange={setCommunityCards}
                usedCards={usedCards}
                maxCards={5}
              />
            )}
          </div>

        </div>

        {/* Row 2 — Player selector, buttons, results */}
        <div className="w-full" style={{ maxWidth: '50rem' }}>
          <PlayerSelector
            playerCount={playerCount}
            onChange={setPlayerCount}
          />

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