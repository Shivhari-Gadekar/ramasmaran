// src/App.jsx
import { useState, useEffect } from "react";
import UpdateForm from "./components/UpdateForm";
import TabbedLeaderboard from "./components/TabbedLeaderboard";
import useLeaderboard from "./hooks/useLeaderboard";
import { deleteUser, editUser, getLeaderboard } from "./api/api";

import {
  getTodayEntries,
  getWeeklyEntries,
  getAllTimeEntries,
} from "./utils/filterLeaderboard";
import { deduplicateEntries } from "./utils/deduplicate";

export default function App() {
  const { leaderboard, loading, setLeaderboard } = useLeaderboard();
  const [currentUser, setCurrentUser] = useState("");

  // Fetch fresh leaderboard on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };
    fetchData();
  }, [setLeaderboard]);

  // Handle editing a user
  const handleEdit = async (name, minutes) => {
    try {
      const updated = await editUser(name, minutes);
      setLeaderboard(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to edit entry.");
    }
  };

  // Handle deleting a user
  const handleDelete = async (name) => {
    try {
      const updated = await deleteUser(name);
      setLeaderboard(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading chanting data...
        </p>
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600">No data available yet.</p>
      </div>
    );
  }

  // Flatten leaderboard and remove duplicates (same user same day)
  const flatLeaderboard = deduplicateEntries([
    ...(leaderboard.daily || []),
    ...(leaderboard.weekly || []),
    ...(leaderboard.allTime || []),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="text-center p-2">
          <h3 className="text-md font-bold">Ram Ram</h3>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Ramasmaran Leaderboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
        <UpdateForm
          onUpdate={async (selectedUser) => {
            setCurrentUser(selectedUser);
            const data = await getLeaderboard();
            setLeaderboard(data);
          }}
        />

        <TabbedLeaderboard
          daily={getTodayEntries(flatLeaderboard)}
          weekly={getWeeklyEntries(flatLeaderboard)}
          allTime={getAllTimeEntries(flatLeaderboard)}
          currentUser={currentUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        Made with ❤️ for the ramsnehi family • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
