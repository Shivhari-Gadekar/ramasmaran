// src/App.jsx
import { useState } from "react";
import UpdateForm from "./components/UpdateForm";
import TabbedLeaderboard from "./components/TabbedLeaderboard";
import useLeaderboard from "./hooks/useLeaderboard";
import { deleteUser, editUser, getLeaderboard } from "./api/api";

export default function App() {
  const { leaderboard, loading, setLeaderboard } = useLeaderboard();
  const [currentUser, setCurrentUser] = useState("");

  const handleEdit = async (name, minutes) => {
    try {
      const updated = await editUser(name, minutes);
      setLeaderboard(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to edit entry.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center sm:justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center">
            🕉️ Daily Chanting Leaderboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Update form */}
        <UpdateForm
          onUpdate={async (selectedUser) => {
            setCurrentUser(selectedUser);
            const data = await getLeaderboard();
            setLeaderboard(data);
          }}
        />

        {/* Leaderboards */}
        <TabbedLeaderboard
          daily={leaderboard?.daily || []}
          weekly={leaderboard?.weekly || []}
          allTime={leaderboard?.allTime || []}
          currentUser={currentUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />


      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        Made with ❤️ for the chanting family • {new Date().getFullYear()}
      </footer>
    </div>
  );
}