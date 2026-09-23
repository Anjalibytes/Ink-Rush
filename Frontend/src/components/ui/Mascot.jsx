// "Scribbs" — the InkRush pencil mascot.
// Pure inline SVG (no network fetch), so it can never fail to load.
// mood: "idle" | "think" | "cheer" | "sleep"
const INK = "#1f1633";

function Face({ mood }) {
  switch (mood) {
    case "cheer":
      return (
        <g>
          <path d="M39 51 q4 -5 8 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M53 51 q4 -5 8 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M42 58 q8 10 16 0 z" fill={INK} />
          <path d="M46 62.5 q4 3 8 0" fill="#f87171" />
        </g>
      );
    case "think":
      return (
        <g>
          <circle cx="44" cy="49" r="4" fill={INK} />
          <circle cx="58" cy="49" r="4" fill={INK} />
          <circle cx="45.4" cy="47.4" r="1.3" fill="#fff" />
          <circle cx="59.4" cy="47.4" r="1.3" fill="#fff" />
          <path d="M45 61 q5 -2 10 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "sleep":
      return (
        <g>
          <path d="M39 51 q4 3 8 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M53 51 q4 3 8 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="61" rx="2.6" ry="2" fill={INK} />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="43" cy="51" r="4" fill={INK} />
          <circle cx="57" cy="51" r="4" fill={INK} />
          <circle cx="44.4" cy="49.6" r="1.3" fill="#fff" />
          <circle cx="58.4" cy="49.6" r="1.3" fill="#fff" />
          <path d="M44 58 q6 6 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      );
  }
}

function Arms({ mood }) {
  const common = { stroke: INK, strokeWidth: 3, strokeLinecap: "round", fill: "none" };
  if (mood === "cheer") {
    return (
      <g>
        <path d="M32 58 L20 42" {...common} />
        <path d="M68 58 L80 42" {...common} />
      </g>
    );
  }
  if (mood === "think") {
    return (
      <g>
        <path d="M32 62 L22 70" {...common} />
        <path d="M68 66 L60 64" {...common} />
      </g>
    );
  }
  if (mood === "sleep") {
    return (
      <g>
        <path d="M32 64 L25 72" {...common} />
        <path d="M68 64 L75 72" {...common} />
      </g>
    );
  }
  return (
    <g>
      <path d="M32 62 L22 70" {...common} />
      <path d="M68 62 L78 54" {...common} />
    </g>
  );
}

function Extras({ mood }) {
  if (mood === "think") {
    return (
      <text x="80" y="24" fontSize="22" fontWeight="800" fill="#fbbf24" fontFamily="Outfit, sans-serif" className="mascot-extra">
        ?
      </text>
    );
  }
  if (mood === "sleep") {
    return (
      <g className="mascot-extra" fill="#5eead4" fontFamily="Outfit, sans-serif" fontWeight="800">
        <text x="72" y="26" fontSize="12">z</text>
        <text x="80" y="16" fontSize="16">Z</text>
      </g>
    );
  }
  if (mood === "cheer") {
    return (
      <g className="mascot-extra" fill="#fbbf24">
        <path d="M14 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        <path d="M86 26 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
        <circle cx="88" cy="50" r="2.4" fill="#f472b6" />
        <circle cx="12" cy="54" r="2" fill="#2dd4bf" />
      </g>
    );
  }
  return null;
}

export default function Mascot({ mood = "idle", size = 96, animate = true, className = "", title = "Scribbs the pencil" }) {
  return (
    <svg
      className={`mascot mascot--${mood} ${animate ? "mascot--animate" : ""} ${className}`}
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      role="img"
      aria-label={title}
    >
      <g className="mascot-body">
        {/* shadow */}
        <ellipse cx="50" cy="116" rx="18" ry="3" fill="rgba(0,0,0,0.35)" />
        <Arms mood={mood} />
        {/* eraser */}
        <rect x="32" y="8" width="36" height="16" rx="6" fill="#f472b6" stroke={INK} strokeWidth="2.5" />
        {/* ferrule */}
        <rect x="31" y="22" width="38" height="10" rx="2" fill="#cbd5e1" stroke={INK} strokeWidth="2.5" />
        <path d="M31 27 H69" stroke={INK} strokeWidth="1.5" opacity="0.5" />
        {/* body */}
        <rect x="32" y="31" width="36" height="50" fill="#fbbf24" stroke={INK} strokeWidth="2.5" />
        <rect x="44" y="32.3" width="12" height="47.5" fill="#f59e0b" opacity="0.55" />
        {/* cheeks */}
        <circle cx="37.5" cy="57" r="3.2" fill="#f472b6" opacity="0.55" />
        <circle cx="62.5" cy="57" r="3.2" fill="#f472b6" opacity="0.55" />
        <Face mood={mood} />
        {/* sharpened wood + graphite tip */}
        <path d="M32 81 L68 81 L50 108 Z" fill="#fde2b8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M44.2 99.6 L55.8 99.6 L50 108 Z" fill={INK} />
      </g>
      <Extras mood={mood} />
    </svg>
  );
}
