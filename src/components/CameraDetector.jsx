import { useRef, useState, useEffect } from 'react';

const MODEL_ID = 'playing-cards-ow27d-esm45';
const MODEL_VERSION = '1';

function CameraDetector({ onCardsDetected, usedCards }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');
  const [detectedCards, setDetectedCards] = useState([]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      videoRef.current.srcObject = stream;
      setIsStreaming(true);
      setError('');
    } catch (err) {
      setError('Camera access denied. Please allow camera permission.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetectedCards([]);
  };

  // Capture frame and detect cards
  const detectCards = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsDetecting(true);
    setError('');

    // Draw video frame to canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = imageData.split(',')[1];

    try {
      const response = await fetch('/api/roboflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          modelId: MODEL_ID,
          modelVersion: MODEL_VERSION,
        }),
      });

      const data = await response.json();
      console.log('Roboflow response:', JSON.stringify(data));

      if (data.predictions && data.predictions.length > 0) {
        const cards = data.predictions
          .filter(p => p.confidence > 0.5)
          .map(p => convertLabel(p.class))
          .filter(c => c !== null)
          .filter(c => !usedCards.includes(c));

        const uniqueCards = [...new Set(cards)];
        setDetectedCards(uniqueCards);

        if (uniqueCards.length > 0) {
          onCardsDetected(uniqueCards);
        } else {
          setError('No new cards detected. Try again.');
        }
      } else {
        setError('No cards detected. Make sure cards are clearly visible.');
      }
    } catch (err) {
      setError('Detection failed. Check your internet connection.');
    }

    setIsDetecting(false);
  };

  // Convert Roboflow label to our format
  const convertLabel = (label) => {
    if (!label) return null;

    const rankMap = {
      'A': 'A', 'K': 'K', 'Q': 'Q', 'J': 'J',
      '10': 'T', '9': '9', '8': '8', '7': '7',
      '6': '6', '5': '5', '4': '4', '3': '3', '2': '2'
    };

    const suitMap = {
      'C': 'c', 'D': 'd', 'H': 'h', 'S': 's'
    };

    const upper = label.toUpperCase();
    const suit = upper.slice(-1);
    const rank = upper.slice(0, -1);

    const convertedRank = rankMap[rank];
    const convertedSuit = suitMap[suit];

    if (!convertedRank || !convertedSuit) return null;
    return convertedRank + convertedSuit;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-4">
      <h2 className="text-green-400 font-bold text-lg mb-4">
        📷 Camera Card Detection
      </h2>

      {/* Video feed */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-4"
           style={{ minHeight: '200px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-xl"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Camera off
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition"
          >
            📷 Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={detectCards}
              disabled={isDetecting}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
            >
              {isDetecting ? '🔍 Detecting...' : '🎯 Detect Cards'}
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              ✕ Stop
            </button>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900 text-red-300 rounded-xl p-3 text-sm mb-3">
          {error}
        </div>
      )}

      {/* Detected cards */}
      {detectedCards.length > 0 && (
        <div className="bg-green-900 rounded-xl p-3">
          <p className="text-green-400 text-sm font-bold mb-2">
            ✅ Detected and added:
          </p>
          <div className="flex gap-2 flex-wrap">
            {detectedCards.map(card => (
              <span
                key={card}
                className="bg-white text-black font-bold px-3 py-1 rounded-lg text-lg"
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {isStreaming && !isDetecting && (
        <div className="mt-3 text-gray-500 text-xs">
          💡 Hold cards flat, good lighting, fill the frame
        </div>
      )}
    </div>
  );
}

export default CameraDetector;