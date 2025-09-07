// src/components/AddTimeForm.jsx
import { useState } from "react";

export default function AddTimeForm({ onAdd }) {
  const [name, setName] = useState("");
  const [timeValue, setTimeValue] = useState(""); // HH:MM format

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }
    if (!timeValue) {
      alert("Please select time");
      return;
    }

    const [h, m] = timeValue.split(":").map(Number);
    const totalMinutes = h * 60 + m;

    if (isNaN(h) || isNaN(m)) {
      alert("Invalid time format");
      return;
    }
    if (totalMinutes <= 0) {
      alert("Time must be greater than 0");
      return;
    }
    if (totalMinutes > 1440) {
      alert("Time cannot exceed 24:00 hours");
      return;
    }

    onAdd(name.trim(), totalMinutes);
    setName("");
    setTimeValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-center bg-white shadow p-4 rounded-xl"
    >
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2 flex-1"
        required
      />

      <input
        type="time"
        step="60"
        value={timeValue}
        onChange={(e) => setTimeValue(e.target.value)}
        className="border rounded-lg px-3 py-2"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition transform hover:scale-105"
      >
        Add
      </button>
    </form>
  );
}
