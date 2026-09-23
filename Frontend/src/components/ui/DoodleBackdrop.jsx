// Hand-drawn doodles scattered across the whole page, sitting behind every
// panel. Pure inline SVG strokes (nothing to load), pointer-events disabled,
// and very low opacity so they add personality without competing with content.
const DOODLES = {
  star: "M32 6 L39 24 L58 25 L43 37 L48 56 L32 45 L16 56 L21 37 L6 25 L25 24 Z",
  spiral: "M32 32 c3 0 4 3 2 5 c-3 3 -8 1 -9 -3 c-1 -6 5 -10 10 -9 c8 1 12 9 9 16 c-3 8 -14 11 -21 6 c-9 -6 -9 -20 0 -26",
  heart: "M32 54 C10 40 6 26 14 18 C21 11 29 15 32 22 C35 15 43 11 50 18 C58 26 54 40 32 54 Z",
  bolt: "M36 4 L16 36 L30 36 L26 60 L48 26 L34 26 Z",
  cloud: "M18 46 C7 46 7 31 18 31 C18 20 33 16 37 27 C43 19 57 23 53 35 C61 37 59 48 50 48 Z",
  sun: "M32 22 a10 10 0 1 0 0.1 0 M32 4 v8 M32 52 v8 M4 32 h8 M52 32 h8 M12 12 l6 6 M46 46 l6 6 M52 12 l-6 6 M12 52 l6 -6",
  squiggle: "M4 36 q7 -14 14 0 t14 0 t14 0 t14 0",
  smiley: "M32 8 a24 24 0 1 0 0.1 0 M24 26 v4 M40 26 v4 M22 38 q10 10 20 0",
  arrow: "M8 50 C16 20 40 14 54 22 M45 14 L55 22 L45 29",
  question: "M22 22 C22 9 43 8 43 20 C43 29 32 30 32 40 M32 50 v2",
  house: "M10 30 L32 10 L54 30 M16 26 V54 H48 V26 M28 54 V40 H36 V54",
  flower: "M32 26 a6 6 0 1 0 0.1 0 M32 20 c-7 -12 7 -12 0 0 M38 32 c12 -7 12 7 0 0 M32 38 c7 12 -7 12 0 0 M26 32 c-12 7 -12 -7 0 0",
  plane: "M6 30 L58 8 L44 56 L30 38 Z M30 38 L58 8",
  loops: "M6 40 c6 -18 14 -18 10 0 c-3 14 10 14 12 -2 c2 -16 14 -14 10 2 c-3 14 10 14 14 -4",
  cat: "M14 24 L17 8 L26 18 Q32 16 38 18 L47 8 L50 24 Q56 42 32 52 Q8 42 14 24 Z M24 32 v3 M40 32 v3 M29 40 l3 2 l3 -2",
  crown: "M8 46 L12 20 L24 34 L32 14 L40 34 L52 20 L56 46 Z",
  pencil: "M12 52 L16 40 L44 12 L52 20 L24 48 Z M40 16 L48 24 M12 52 L24 48",
  sparkle: "M32 8 L35 29 L56 32 L35 35 L32 56 L29 35 L8 32 L29 29 Z",
};

const TEAL = "#2dd4bf";
const PINK = "#f472b6";
const AMBER = "#fbbf24";
const WHITE = "#e2e8f0";

// left/top in %, size in px, rotation in deg. "sm" = also shown on phones.
const PLACEMENTS = [
  { d: "star", left: 4, top: 6, size: 54, rot: -12, color: AMBER, sm: true },
  { d: "squiggle", left: 18, top: 3, size: 90, rot: 4, color: TEAL },
  { d: "cloud", left: 31, top: 12, size: 70, rot: 0, color: WHITE },
  { d: "spiral", left: 62, top: 4, size: 56, rot: 20, color: PINK, sm: true },
  { d: "sun", left: 86, top: 8, size: 72, rot: 10, color: AMBER, sm: true },
  { d: "plane", left: 3, top: 30, size: 64, rot: -8, color: TEAL, sm: true },
  { d: "heart", left: 93, top: 30, size: 46, rot: 14, color: PINK },
  { d: "question", left: 10, top: 52, size: 58, rot: -14, color: PINK, sm: true },
  { d: "loops", left: 88, top: 50, size: 80, rot: -6, color: TEAL, sm: true },
  { d: "smiley", left: 2, top: 74, size: 60, rot: 8, color: AMBER },
  { d: "house", left: 22, top: 86, size: 58, rot: -6, color: WHITE, sm: true },
  { d: "cat", left: 44, top: 90, size: 56, rot: 6, color: PINK },
  { d: "bolt", left: 66, top: 84, size: 52, rot: 12, color: AMBER, sm: true },
  { d: "crown", left: 90, top: 78, size: 58, rot: -10, color: AMBER },
  { d: "flower", left: 78, top: 22, size: 54, rot: 0, color: TEAL },
  { d: "arrow", left: 76, top: 91, size: 64, rot: -20, color: WHITE },
  { d: "pencil", left: 30, top: 66, size: 56, rot: 0, color: TEAL },
  { d: "sparkle", left: 72, top: 64, size: 36, rot: 0, color: PINK, sm: true },
  { d: "sparkle", left: 55, top: 46, size: 26, rot: 20, color: AMBER },
];

export default function DoodleBackdrop() {
  return (
    <div className="doodle-backdrop" aria-hidden="true">
      {PLACEMENTS.map((p, i) => (
        <svg
          key={i}
          className={`doodle ${p.sm ? "" : "doodle--hide-sm"}`}
          viewBox="0 0 64 64"
          width={p.size}
          height={p.size}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            "--rot": `${p.rot}deg`,
            animationDelay: `${(i % 7) * -1.3}s`,
            animationDuration: `${9 + (i % 5) * 1.7}s`,
          }}
        >
          <path
            d={DOODLES[p.d]}
            fill="none"
            stroke={p.color}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
