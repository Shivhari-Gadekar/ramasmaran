// src/components/Leaderboard.jsx
export default function Leaderboard({ leaders = [], currentUser = "", onEdit, onDelete }) {
  if (!leaders || leaders.length === 0) {
    return <p className="text-gray-500 text-center py-4">No updates yet.</p>;
  }

  // Sort by minutes descending
  const sortedLeaders = [...leaders].sort((a, b) => (b.minutes || 0) - (a.minutes || 0));

  const getMedal = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "");

  const isEditable = (timestamp) => {
    if (!timestamp) return false;
    return (new Date() - new Date(timestamp)) / (1000 * 60 * 60) <= 24; // editable within 24 hours
  };

  return (
    <ul className="space-y-3">
      {sortedLeaders.map((entry, index) => (
        <li
          key={entry.name + (entry.lastUpdate || "")}
          className={`p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:justify-between items-center
                      ${entry.name === currentUser ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {getMedal(index)} {entry.name || "Unknown"}
            </span>
          </div>
          <div className="text-gray-700 font-medium mt-2 sm:mt-0">
            {entry.minutes != null ? entry.minutes : 0} min
          </div>

          {isEditable(entry.lastUpdate) && onEdit && onDelete && (
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs shadow transition transform hover:scale-105"
                onClick={() => {
                  const newMinutes = prompt(`Edit minutes for ${entry.name}`, entry.minutes);
                  if (newMinutes != null && !isNaN(newMinutes)) onEdit(entry.name, Number(newMinutes));
                }}
              >
                Edit
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow transition transform hover:scale-105"
                onClick={() => {
                  if (confirm(`Delete ${entry.name}?`)) onDelete(entry.name);
                }}
              >
                Delete
              </button>
            </div>
          )}

          {!isEditable(entry.lastUpdate) && (
            <div className="text-xs text-gray-400 italic mt-1 sm:mt-0">
              Editable only within 24 hours
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
