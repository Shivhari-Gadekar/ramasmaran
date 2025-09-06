// src/components/UpdateForm.jsx
import { useState } from "react";
import { updateChant } from "../api/api";

const PRESETS = [
  { label: "15M", minutes: 15, color: "from-blue-400 to-blue-500" },
  { label: "30M", minutes: 30, color: "from-green-400 to-green-500" },
  { label: "1H", minutes: 60, color: "from-orange-400 to-orange-500" },
  { label: "1:15H", minutes: 75, color: "from-pink-400 to-pink-500" },
  { label: "2H", minutes: 120, color: "from-purple-400 to-purple-500" },
  { label: "3H", minutes: 180, color: "from-teal-400 to-teal-500" },
];

const FRIENDS = ["Gayatri", "Vishakha", "Kunal", "Yogesh"];

export default function UpdateForm({ onUpdate }) {
  const [name, setName] = useState("");
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  async function handleSubmit(minutes) {
    const finalName = name.trim();
    if (!finalName) return alert("Please select or enter your name.");
    if (!minutes || isNaN(minutes)) return alert("Minutes must be a number.");
    if (minutes < 0 || minutes > 1440)
      return alert("Minutes must be between 0 and 1440.");

    try {
      await updateChant(finalName, minutes);
      setCustom("");
      setShowCustom(false);
      setName("");
      if (onUpdate) onUpdate();
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
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mb-4"
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
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mb-4"
        />
      )}

      {/* Preset buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleSubmit(preset.minutes)}
            className={`flex justify-center items-center px-4 py-2 rounded-xl font-semibold shadow-lg transform transition hover:scale-105 text-white bg-gradient-to-r ${preset.color}`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom minutes input */}
      {showCustom && (
        <div className="flex gap-3 items-center mt-4 p-4 bg-gray-50 rounded-xl shadow-inner">
          <input
            type="number"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Minutes"
            min="0"
            max="1440"
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <button
            onClick={() => handleSubmit(Number(custom))}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            Add
          </button>
        </div>
      )}

      {/* Toggle custom minutes */}
      {!showCustom && (
        <button
          onClick={() => setShowCustom(true)}
          className="text-sm text-gray-500 hover:text-gray-700 underline mt-3 block text-center"
        >
          Enter custom time in minutes
        </button>
      )}
    </div>
  );
}
