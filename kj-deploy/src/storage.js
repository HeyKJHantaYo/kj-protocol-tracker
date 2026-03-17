import { supabase } from "./supabase";

// localStorage cache prefix
const CACHE = "kj:";

// Write to both Supabase and localStorage
export async function saveS(key, val) {
  const json = JSON.stringify(val);
  // Always cache locally first (instant, works offline)
  try { localStorage.setItem(CACHE + key, json); } catch (e) { /* quota */ }
  // Then persist to Supabase
  try {
    const { error } = await supabase
      .from("kv_store")
      .upsert({ key, value: json, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) console.error("Supabase save error:", error.message);
  } catch (e) {
    console.error("Supabase unreachable, data cached locally:", e.message);
  }
}

// Read from Supabase first, fallback to localStorage
export async function loadS(key, fallback) {
  try {
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", key)
      .single();
    if (!error && data) {
      const parsed = JSON.parse(data.value);
      // Update local cache
      try { localStorage.setItem(CACHE + key, data.value); } catch (e) { /* quota */ }
      return parsed;
    }
  } catch (e) {
    // Network error — fall through to cache
  }
  // Fallback: localStorage cache
  try {
    const cached = localStorage.getItem(CACHE + key);
    if (cached) return JSON.parse(cached);
  } catch (e) { /* parse error */ }
  return fallback;
}

// Delete from both
export async function deleteS(key) {
  try { localStorage.removeItem(CACHE + key); } catch (e) {}
  try {
    await supabase.from("kv_store").delete().eq("key", key);
  } catch (e) {
    console.error("Supabase delete error:", e.message);
  }
}
