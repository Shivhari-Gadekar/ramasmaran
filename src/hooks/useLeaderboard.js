// src/hooks/useLeaderboard.js
import { useState, useEffect } from "react";
import { getLeaderboard } from "../api/api";

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to fetch leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
    setLeaderboard,
    refresh: fetchLeaderboard, // manual refresh
  };
}
