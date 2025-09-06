// src/components/ChantList.jsx
export default function ChantList({ chantings, onEdit, onDelete }) {
  if (!chantings.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No chants added yet 🙏
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Daily Chants
      </h2>
      <ul className="space-y-4">
        {chantings.map((chant) => (
          <li
            key={chant.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {/* Info */}
            <div>
              <p className="font-medium text-gray-800">
                {chant.user_name}
              </p>
              <p className="text-sm text-gray-600">
                {chant.chant_count} chants on{" "}
                {new Date(chant.chant_date).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(chant)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(chant.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
