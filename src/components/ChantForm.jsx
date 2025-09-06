// src/components/ChantForm.jsx
import { useState } from "react";

export default function ChantForm({ onSubmit, initialData }) {
  const [userName, setUserName] = useState(initialData?.user_name || "");
  const [chantCount, setChantCount] = useState(initialData?.chant_count || "");
  const [chantDate, setChantDate] = useState(
    initialData?.chant_date || new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName || !chantCount) return;

    onSubmit({
      user_name: userName.trim(),
      chant_count: Number(chantCount),
      chant_date: chantDate,
    });

    // reset if it's a new entry
    if (!initialData) {
      setUserName("");
      setChantCount("");
      setChantDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg mx-auto mt-20"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {initialData ? "Update Chant" : "Add Daily Chant"}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Chant Count */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Chant Count
        </label>
        <input
          type="number"
          value={chantCount}
          onChange={(e) => setChantCount(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter chants"
          min="1"
          required
        />
      </div>

      {/* Date */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Date
        </label>
        <input
          type="date"
          value={chantDate}
          onChange={(e) => setChantDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
      >
        {initialData ? "Update" : "Submit"}
      </button>
    </form>
  );
}
