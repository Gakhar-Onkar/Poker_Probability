import { useState } from 'react';

function CoachPanel({ holeCards, communityCards, playerCount, results }) {
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getAdvice = async () => {
        if (!results) {
            alert('Please calculate odds first!');
            return;
        }

        if (holeCards.length < 2) {
            alert('Please select your hole cards first!');
            return;
        }

        setIsLoading(true);
        setAdvice('');
        setError('');

        const street =
            communityCards.length === 0 ? 'Pre-flop' :
                communityCards.length === 3 ? 'Flop' :
                    communityCards.length === 4 ? 'Turn' : 'River';

        const prompt = `You are a professional poker coach. Analyze this situation:

- My hole cards: ${holeCards.join(', ')}
- Community cards: ${communityCards.length > 0 ? communityCards.join(', ') : 'None (pre-flop)'}
- Street: ${street}
- Total players: ${playerCount} (${playerCount - 1} opponents)
- My win probability: ${results.wins}%
- Tie probability: ${results.ties}%
- Lose probability: ${results.losses}%

Give me 2-3 sentences of practical poker advice. Include:
1. My current hand strength
2. Whether I should fold, call, or raise
3. Why

Be direct, concise and specific.`;

        try {
            const response = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            console.log('Groq response:', JSON.stringify(data));

            if (data.choices && data.choices[0]) {
                setAdvice(data.choices[0].message.content);
            } else {
                setError('No response received. Try again.');
            }

        } catch (err) {
            setError('Failed to get advice. Check your connection.');
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 mt-4">
            <h2 className="text-green-400 font-bold text-lg mb-4">
                🤖 AI Coaching
            </h2>

            <button
                onClick={getAdvice}
                disabled={isLoading || !results}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-lg transition mb-4"
            >
                {isLoading ? '🤔 Analyzing your hand...' : '💡 Get AI Advice'}
            </button>

            {!results && (
                <p className="text-gray-500 text-sm text-center">
                    Calculate odds first to get AI advice
                </p>
            )}

            {isLoading && (
                <div className="text-yellow-400 text-center animate-pulse text-sm">
                    Thinking...
                </div>
            )}

            {error && (
                <div className="bg-red-900 text-red-300 rounded-xl p-3 text-sm">
                    {error}
                </div>
            )}

            {advice && (
                <div className="bg-gray-700 rounded-xl p-4 text-gray-200 leading-relaxed">
                    <p className="text-blue-400 text-xs font-bold mb-2">COACH SAYS:</p>
                    {advice}
                </div>
            )}
        </div>
    );
}

export default CoachPanel;