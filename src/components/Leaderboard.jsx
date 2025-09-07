// src/components/Leaderboard.jsx
import { formatHHMM } from "../api/api";
import { useState } from "react";

export default function Leaderboard({ leaders = [], currentUser = "", onEdit, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const isEditable = (timestamp) => {
    if (!timestamp) return false;
    return (new Date() - new Date(timestamp)) / (1000 * 60 * 60) <= 24;
  };

  const validateHHMM = (input) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(input);
    if (!match) return null;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  };

  return (
    <ul className="space-y-3">
      {leaders.map((entry, index) => {
        const editable = isEditable(entry.lastUpdate);

        return (
          <li
            key={entry.name + (entry.lastUpdate || "")}
            className={`p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:justify-between items-center
                        ${entry.name === currentUser ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""} {entry.name}
              </span>
            </div>

            <div className="text-gray-700 font-medium mt-2 sm:mt-0">
              {formatHHMM(entry.totalMinutes)}
            </div>

            {editable && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                {editing === entry.name ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="HH:MM"
                      className="border px-2 py-1 rounded-md w-20"
                    />
                    <button
                      onClick={() => {
                        const minutes = validateHHMM(editValue);
                        if (minutes == null) {
                          alert("Enter valid HH:MM (00:00 – 24:00)");
                          return;
                        }
                        onEdit(entry.name, minutes);
                        setEditing(null);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded-md text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded-md text-xs"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                      onClick={() => {
                        setEditing(entry.name);
                        setEditValue(formatHHMM(entry.minutes ?? 0));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                      onClick={() => {
                        if (confirm(`Delete ${entry.name}?`)) onDelete(entry.name);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
