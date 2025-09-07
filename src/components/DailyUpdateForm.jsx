// src/components/DailyUpdateForm.jsx
import { useState } from "react";

export default function DailyUpdateForm({ users = [], onAdd, todaysLeaders = [] }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [minutes, setMinutes] = useState("");

  // Get names who already added today
  const alreadyAdded = todaysLeaders.map(entry => entry.name);

  // Filter users so dropdown only shows available ones
  const availableUsers = users.filter(user => !alreadyAdded.includes(user));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }
    if (!minutes || isNaN(minutes)) {
      alert("Please enter valid minutes");
      return;
    }
    if (minutes > 1440) {
      alert("Minutes cannot exceed 24 hours (1440 minutes)");
      return;
    }

    onAdd(selectedUser, Number(minutes));
    setSelectedUser("");
    setMinutes("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="">Select User</option>
        {availableUsers.length === 0 ? (
          <option disabled>All users already added today</option>
        ) : (
          availableUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))
        )}
      </select>

      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        placeholder="Enter minutes"
        className="border rounded-lg p-2 w-32"
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
