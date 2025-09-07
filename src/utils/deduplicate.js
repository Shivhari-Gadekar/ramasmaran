// src/utils/deduplicate.js
export function deduplicateEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const key = `${entry.name}-${new Date(entry.lastUpdate).toDateString()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
