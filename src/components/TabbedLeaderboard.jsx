// src/components/TabbedLeaderboard.jsx
import { useState } from "react";
import Leaderboard from "./Leaderboard";

export default function TabbedLeaderboard({
  daily = [],
  weekly = [],
  allTime = [],
  currentUser = "",
  onEdit,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { id: "daily", label: "📅 Today" },
    { id: "weekly", label: "📆 Weekly" },
    { id: "allTime", label: "🌟 All-Time" },
  ];

  const getLeaders = () => {
    if (activeTab === "daily") return daily || [];
    if (activeTab === "weekly") return weekly || [];
    return allTime || [];
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* Tab Buttons */}
      <div className="flex justify-center sm:justify-start border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg p-4 sm:p-6">
        <Leaderboard
          leaders={getLeaders()} // always ensures array
          currentUser={currentUser}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
