function PlayerSelector({ playerCount, onChange }) {
  const players = [2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-4">
      <h2 className="text-green-400 font-bold text-lg mb-4">
        Number of Players (including you)
      </h2>

      <div className="flex gap-3 flex-wrap">
        {players.map(num => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`
              w-12 h-12 rounded-xl font-bold text-lg transition-all
              ${playerCount === num
                ? 'bg-green-500 text-white scale-110'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Selected: <span className="text-white font-bold">{playerCount} players</span>
        &nbsp;→&nbsp;
        <span className="text-yellow-400">{playerCount - 1} opponents</span>
      </p>
    </div>
  );
}

export default PlayerSelector;