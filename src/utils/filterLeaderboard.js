// src/utils/filterLeaderboard.js

export function getTodayEntries(entries) {
  if (!Array.isArray(entries)) return [];
  const today = new Date().toDateString();
  return entries.filter((e) => new Date(e.lastUpdate).toDateString() === today);
}

export function getWeeklyEntries(entries) {
  if (!Array.isArray(entries)) return [];
  const now = new Date();

  return entries
    .filter((e) => {
      const entryDate = new Date(e.lastUpdate);
      const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
      return diffDays < 7;
    })
    .map((e) => ({
      ...e,
      weekday: new Date(e.lastUpdate).toLocaleDateString("en-US", { weekday: "short" }),
    }))
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}

export function getAllTimeEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((e) => ({
      ...e,
      date: new Date(e.lastUpdate).toLocaleDateString("en-GB"),
    }))
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}
