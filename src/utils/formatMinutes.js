// src/utils/formatMinutes.js

export function formatMinutes(minutes) {
  if (minutes == null || isNaN(minutes)) return "";

  if (minutes < 60) {
    return `${minutes}M`; // e.g., 30M
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}H`; // e.g., 3H
  }

  return `${hours}:${mins < 10 ? "0" : ""}${mins}H`; // e.g., 1:15H
}
