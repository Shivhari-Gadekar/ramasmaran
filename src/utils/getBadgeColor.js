// src/utils/getBadgeColor.js

export function getBadgeColor(minutes) {
  if (minutes <= 30) return "bg-green-500 text-white";
  if (minutes <= 90) return "bg-orange-500 text-white";
  if (minutes <= 180) return "bg-purple-500 text-white";
  return "bg-teal-500 text-white";
}
