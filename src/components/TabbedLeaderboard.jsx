// src/components/TabbedLeaderboard.jsx
import { useState } from "react";
import { formatMinutes } from "../utils/formatMinutes";
import { getBadgeColor } from "../utils/getBadgeColor";

export default function TabbedLeaderboard({
  daily = [],
  weekly = [],
  allTime = [],
  currentUser,
  onEdit,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { id: "daily", label: "Today" },
    { id: "weekly", label: "This Week" },
    { id: "allTime", label: "All Time" },
  ];

  const getTabData = () => {
    if (activeTab === "daily") return daily;
    if (activeTab === "weekly") return weekly;
    if (activeTab === "allTime") return allTime;
    return [];
  };

  const renderHeader = () => {
    if (activeTab === "daily") return <th className="px-4 py-2">Name</th>;
    if (activeTab === "weekly") return <th className="px-4 py-2">Day</th>;
    if (activeTab === "allTime") return <th className="px-4 py-2">Date</th>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full overflow-x-auto">
      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-full font-semibold text-sm sm:text-base flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {renderHeader()}
            {activeTab !== "daily" && <th className="px-4 py-2">Name</th>}
            <th className="px-4 py-2">Time</th>
            {activeTab === "daily" && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {getTabData().length === 0 ? (
            <tr>
              <td
                colSpan={activeTab === "daily" ? 4 : 3}
                className="px-4 py-3 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          ) : (
            getTabData().map((entry, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  entry.name === currentUser ? "bg-blue-50" : ""
                }`}
              >
                {activeTab === "weekly" && (
                  <td className="px-4 py-2">{entry.weekday}</td>
                )}
                {activeTab === "allTime" && (
                  <td className="px-4 py-2">{entry.date}</td>
                )}
                {activeTab !== "daily" && <td className="px-4 py-2">{entry.name}</td>}
                {activeTab === "daily" && <td className="px-4 py-2">{entry.name}</td>}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                      entry.minutes
                    )}`}
                  >
                    {formatMinutes(entry.minutes)}
                  </span>
                </td>
                {activeTab === "daily" && (
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => onEdit(entry.name, entry.minutes)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry.name)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
