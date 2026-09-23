// Deterministic avatar colors: the same name always gets the same color,
// on every client, without any server changes.
const AVATAR_COLORS = [
  "#f472b6", // pink
  "#fb923c", // orange
  "#fbbf24", // amber
  "#a3e635", // lime
  "#34d399", // emerald
  "#2dd4bf", // teal
  "#38bdf8", // sky
  "#818cf8", // indigo
  "#c084fc", // purple
  "#f87171", // coral
];

export function avatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function initials(name = "") {
  const clean = name.trim();
  if (!clean) return "?";
  const parts = clean.split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.substring(0, 2).toUpperCase();
}

// Shared icon sizing so every lucide icon has the same weight app-wide
export const ICON = { size: 18, strokeWidth: 2.25 };
export const ICON_SM = { size: 15, strokeWidth: 2.25 };
