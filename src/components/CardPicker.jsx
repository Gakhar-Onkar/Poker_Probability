const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = [
  { symbol: '♠', name: 's', color: 'text-gray-900', gridColor: 'text-white' },
  { symbol: '♥', name: 'h', color: 'text-red-500', gridColor: 'text-red-400' },
  { symbol: '♦', name: 'd', color: 'text-red-500', gridColor: 'text-red-400' },
  { symbol: '♣', name: 'c', color: 'text-gray-900', gridColor: 'text-white' },
];

function CardPicker({ label, selected, onChange, usedCards, maxCards = 52 }) {
    const toggleCard = (card) => {
        if (selected.includes(card)) {
            onChange(selected.filter(c => c !== card));
        } else if (selected.length >= maxCards) {
            return;
        } else if (usedCards.includes(card)) {
            return;
        } else {
            onChange([...selected, card]);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 mb-4 w-96">
            <h2 className="text-green-400 font-bold text-lg mb-3">{label}</h2>

            {/* Selected cards display */}
            <div className="flex gap-2 mb-4 min-h-12 flex-wrap">
                {selected.length === 0 ? (
                    <p className="text-gray-500 text-sm">No cards selected</p>
                ) : (
                    selected.map(card => {
                        const rank = card.slice(0, -1);
                        const suitName = card.slice(-1);
                        const suit = SUITS.find(s => s.name === suitName);
                        return (
                            <span
                                key={card}
                                onClick={() => toggleCard(card)}
                                className={`bg-white font-bold px-3 py-1 rounded-lg cursor-pointer hover:bg-red-200 transition text-lg ${suit.color}`}
                            >
                                {rank}{suit.symbol}
                            </span>
                        );
                    })
                )}
            </div>

            {/* Card grid */}
            <div className="flex justify-center">
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="w-8"></th>
                            {SUITS.map(suit => (
                                <th key={suit.name} className={`text-center px-1 pb-1 text-lg ${suit.gridcolor}`}>
                                    {suit.symbol}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RANKS.map(rank => (
                            <tr key={rank}>
                                <td className="text-gray-400 text-sm font-bold pr-2">{rank}</td>
                                {SUITS.map(suit => {
                                    const card = rank + suit.name;
                                    const isSelected = selected.includes(card);
                                    const isUsed = usedCards.includes(card) && !isSelected;

                                    return (
                                        <td key={suit.name} className="p-0.5 w-1/4">
                                            <button
                                                onClick={() => toggleCard(card)}
                                                disabled={isUsed}
                                                className={`
                          w-full h-11 rounded text-sm font-bold transition-all
                          ${isSelected
                                                        ? 'bg-green-500 text-white scale-105'
                                                        : isUsed
                                                            ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                                                            : 'bg-gray-600 hover:bg-gray-500 text-white cursor-pointer'
                                                    }
                        `}
                                            >
                                                {rank}{suit.symbol}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CardPicker;