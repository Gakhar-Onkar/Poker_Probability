function Results({ results, isCalculating }) {
  if (isCalculating) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <div className="text-yellow-400 text-lg font-bold animate-pulse">
          ⏳ Simulating 50,000 hands...
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-green-400 font-bold text-lg mb-4">
        Results
      </h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-green-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Win</p>
          <p className="text-green-400 text-3xl font-bold">{results.wins}%</p>
        </div>
        <div className="flex-1 bg-yellow-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Tie</p>
          <p className="text-yellow-400 text-3xl font-bold">{results.ties}%</p>
        </div>
        <div className="flex-1 bg-red-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Lose</p>
          <p className="text-red-400 text-3xl font-bold">{results.losses}%</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm w-8">Win</span>
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${results.wins}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm w-8">Tie</span>
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${results.ties}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm w-8">Lose</span>
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${results.losses}%` }}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Results;