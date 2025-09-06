// src/api/api.js
import { supabase } from "../services/supabaseClient";

/**
 * Fetch the leaderboard data
 */
export async function getLeaderboard() {
  try {
    const { data, error } = await supabase
      .from("chantings")
      .select("*")
      .order("chant_date", { ascending: false });

    if (error) throw error;

    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const mapData = (entries) =>
      entries.map((d) => ({
        name: d.user_name,
        minutes: d.chant_count, // map chant_count → minutes
        lastUpdate: d.created_at, // for edit checks
        chantDate: d.chant_date,
      }));

    const daily = mapData(data.filter((d) => new Date(d.chant_date).toDateString() === now.toDateString()));
    const weekly = mapData(data.filter((d) => new Date(d.chant_date) >= startOfWeek));
    const allTime = mapData(data);

    return { daily, weekly, allTime };
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return { daily: [], weekly: [], allTime: [] };
  }
}


/**
 * Add or update a user's chanting minutes
 */
export async function updateChant(user_name, minutes) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if record exists for today
    const { data: existing, error: selectError } = await supabase
      .from("chantings")
      .select("*")
      .eq("user_name", user_name)
      .eq("chant_date", today)
      .single();

    if (selectError && selectError.code !== "PGRST116") throw selectError;

    if (existing) {
      // Update existing
      const { error: updateError } = await supabase
        .from("chantings")
        .update({ chant_count: minutes, created_at: new Date() })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from("chantings")
        .insert({ user_name, chant_count: minutes, chant_date: today });
      if (insertError) throw insertError;
    }

    return getLeaderboard();
  } catch (err) {
    console.error("Error updating chant:", err);
    throw err;
  }
}

/**
 * Edit a user's chant (any day)
 */
export async function editUser(user_name, minutes) {
  try {
    const { error } = await supabase
      .from("chantings")
      .update({ chant_count: minutes, created_at: new Date() })
      .eq("user_name", user_name)
      .eq("chant_date", new Date().toISOString().split("T")[0]); // optional today only
    if (error) throw error;

    return getLeaderboard();
  } catch (err) {
    console.error("Error editing user:", err);
    throw err;
  }
}

/**
 * Delete a user's entry
 */
export async function deleteUser(user_name) {
  try {
    const { error } = await supabase
      .from("chantings")
      .delete()
      .eq("user_name", user_name)
      .eq("chant_date", new Date().toISOString().split("T")[0]);
    if (error) throw error;

    return getLeaderboard();
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
}

/**
 * Optional: Delete all entries
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
