// src/api/api.js
import { supabase } from "../services/supabaseClient";

/**
 * Utility: Aggregate minutes per user and compute lastUpdate
 * Returns array of { name, minutes, lastUpdate }
 */
function aggregate(entries = []) {
  const map = Object.create(null);

  for (const d of entries) {
    const name = d.user_name || "Unknown";
    const minutes = Number(d.chant_count || 0);
    const createdAt = d.created_at ? new Date(d.created_at) : null;

    if (!map[name]) {
      map[name] = { name, minutes: 0, lastUpdate: createdAt };
    }
    map[name].minutes += minutes;

    // track the most recent update time
    if (createdAt && (!map[name].lastUpdate || createdAt > map[name].lastUpdate)) {
      map[name].lastUpdate = createdAt;
    }
  }

  // convert to array and sort by minutes desc
  return Object.values(map)
    .map((x) => ({
      name: x.name,
      minutes: x.minutes,
      // convert Date to ISO string for UI convenience (nullable)
      lastUpdate: x.lastUpdate ? x.lastUpdate.toISOString() : null,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Fetch the leaderboard data (daily / weekly / allTime)
 * Based on chant_date (stored as YYYY-MM-DD)
 */
export async function getLeaderboard() {
  try {
    const { data, error } = await supabase
      .from("chantings")
      .select("*")
      .order("chant_date", { ascending: false });

    if (error) throw error;
    const rows = data || [];

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const startOfWeek = new Date(now);
    // start of week = sunday (you previously used this)
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekStart = startOfWeek.toISOString().split("T")[0];

    const dailyRows = rows.filter((r) => String(r.chant_date) === today);
    const weeklyRows = rows.filter((r) => String(r.chant_date) >= weekStart);
    const allRows = rows;

    const daily = aggregate(dailyRows);
    const weekly = aggregate(weeklyRows);
    const allTime = aggregate(allRows);

    return { daily, weekly, allTime };
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return { daily: [], weekly: [], allTime: [] };
  }
}

/**
 * Add or update a user's chanting minutes for today
 * - If an entry exists for (user_name, today) => update
 * - Else insert
 */
export async function updateChant(user_name, minutes) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Use maybeSingle to avoid throwing when no row exists
    const { data: existing, error: selectError } = await supabase
      .from("chantings")
      .select("*")
      .eq("user_name", user_name)
      .eq("chant_date", today)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing && existing.id) {
      // Update existing row
      const { error: updateError } = await supabase
        .from("chantings")
        .update({ chant_count: minutes, created_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      // Insert new row
      const { error: insertError } = await supabase
        .from("chantings")
        .insert([{ user_name, chant_count: minutes, chant_date: today }]);
      if (insertError) throw insertError;
    }

    return getLeaderboard();
  } catch (err) {
    console.error("Error updating chant:", err);
    throw err;
  }
}

/**
 * Edit a user's chant (only if within 24 hours of creation)
 * Throws if not allowed
 */
export async function editUser(user_name, minutes) {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data: record, error: fetchError } = await supabase
      .from("chantings")
      .select("*")
      .eq("user_name", user_name)
      .eq("chant_date", today)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!record) throw new Error("No record found to edit for today.");

    const createdAt = record.created_at ? new Date(record.created_at) : null;
    if (!createdAt) throw new Error("Record missing created_at, cannot verify edit window.");

    const now = new Date();
    const diffHrs = (now - createdAt) / (1000 * 60 * 60);
    if (diffHrs > 24) {
      throw new Error("Editing not allowed after 24 hours");
    }

    const { error } = await supabase
      .from("chantings")
      .update({ chant_count: minutes, created_at: new Date().toISOString() })
      .eq("id", record.id);

    if (error) throw error;
    return getLeaderboard();
  } catch (err) {
    console.error("Error editing user:", err);
    throw err;
  }
}

/**
 * Format minutes into a friendly string:
 * - If exact hours -> "X hr" (e.g. 120 -> "2 hr")
 * - Else -> "H:MM" (e.g. 135 -> "2:15")
 * - For < 1 hour -> "0:MM" (e.g. 30 -> "0:30")
 */
// src/api/api.js
export function formatMinutes(minutes) {
  if (isNaN(minutes) || minutes < 0) return "00:00";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// src/api/api.js
export function formatHHMM(minutes) {
  if (isNaN(minutes)) return "00:00";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}



/**
 * Delete a user's entry for today
 */
export async function deleteUser(user_name) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase
      .from("chantings")
      .delete()
      .eq("user_name", user_name)
      .eq("chant_date", today);
    if (error) throw error;
    return getLeaderboard();
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
}

/**
 * Optional: delete all rows (dev only)
 */
export async function deleteAll() {
  try {
    const { error } = await supabase.from("chantings").delete().neq("id", 0);
    if (error) throw error;
    return getLeaderboard();
  } catch (err) {
    console.error("Error deleting all:", err);
    return { daily: [], weekly: [], allTime: [] };
  }
}
