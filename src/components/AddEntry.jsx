// src/components/AddEntry.jsx
import { useState } from "react";
import { formatHHMM } from "../api/api";

export default function AddEntry({ onAdd }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState(""); // HH:MM string

  const validateHHMM = (input) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(input);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    if (hours < 0 || hours > 23 || mins < 0 || mins > 59) return null;
    const total = hours * 60 + mins;
    if (total > 24 * 60) return null; // max 24:00
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalMinutes = validateHHMM(time);
    if (!name || totalMinutes == null) {
      alert("Enter valid name and time in HH:MM format (00:00 – 24:00).");
      return;
    }
    onAdd(name, totalMinutes);
    setName("");
    setTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full sm:w-auto"
      />

      <input
        type="text"
        placeholder="HH:MM"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full sm:w-auto"
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Add
      </button>
    </form>
  );
}
