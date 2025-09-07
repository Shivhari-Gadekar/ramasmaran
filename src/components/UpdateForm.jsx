// src/components/UpdateForm.jsx
import { useState } from "react";
import { updateChant } from "../api/api";
import { formatMinutes } from "../utils/formatMinutes";
import { getBadgeColor } from "../utils/getBadgeColor";

// Preset buttons
const PRESETS = [
  { minutes: 15, color: "from-blue-400 to-blue-500" },
  { minutes: 30, color: "from-green-400 to-green-500" },
  { minutes: 60, color: "from-orange-400 to-orange-500" },
  { minutes: 75, color: "from-pink-400 to-pink-500" },
  { minutes: 120, color: "from-purple-400 to-purple-500" },
  { minutes: 180, color: "from-teal-400 to-teal-500" },
];

const FRIENDS = ["Gayatri", "Vishakha", "Kunal", "Yogesh"];

// Parse HH:MM input
function parseHHMM(str) {
  if (!str) return null;
  const parts = str.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 1 && !isNaN(parts[0])) return parts[0] * 60;
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return parts[0] * 60 + parts[1];
  return null;
}

export default function UpdateForm({ leaders = [], onUpdate }) {
  const [name, setName] = useState("");
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  function alreadyAddedToday(user) {
    const today = new Date().toDateString();
    const entry = leaders.find((l) => l.name === user);
    if (!entry || !entry.lastUpdate) return false;
    return new Date(entry.lastUpdate).toDateString() === today;
  }

  async function handleSubmit(minutes) {
    const finalName = name.trim();
    if (!finalName) return alert("Please select or enter your name.");
    if (!minutes || isNaN(minutes)) return alert("Time must be valid.");
    if (minutes < 0 || minutes > 1440) return alert("Time must be between 0 and 24 hours.");
    if (alreadyAddedToday(finalName)) {
      return alert("You already added today. Please edit your existing entry.");
    }

    try {
      await updateChant(finalName, minutes);
      setCustom("");
      setShowCustom(false);
      setName("");
      if (onUpdate) onUpdate(finalName);
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Something went wrong. Try again.");
    }
  }

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl max-w-lg mx-auto w-full">
      {/* Name selection */}
      {!showCustom ? (
        <select
          value={name}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setShowCustom(true);
              setName("");
            } else {
              setName(e.target.value);
            }
          }}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 mb-4"
        >
          <option value="">Select your name</option>
          {FRIENDS.map((friend) => (
            <option key={friend} value={friend}>
              {friend}
            </option>
          ))}
          <option value="custom">Add custom name</option>
        </select>
      ) : (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 mb-4"
        />
      )}

      {/* Preset buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => handleSubmit(preset.minutes)}
            className={`px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r ${preset.color}`}
          >
            {formatMinutes(preset.minutes)}
          </button>
        ))}
      </div>

      {/* Custom HH:MM input */}
      <div className="flex gap-3 items-center mt-4 p-4 bg-gray-50 rounded-xl">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="HH:MM (e.g., 2:15)"
          className="flex-1 border border-gray-300 rounded-lg p-3"
        />
        <button
          onClick={() => {
            const minutes = parseHHMM(custom);
            if (minutes != null) {
              handleSubmit(minutes);
            } else {
              alert("Enter time in HH:MM format (e.g., 1:30).");
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>
    </div>
  );
}
