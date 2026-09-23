import { useEffect, useMemo, useState } from "react";
import { useSocket } from "../../context/SocketContext";

const PARTICLE_COLORS = ["#fbbf24", "#f59e0b", "#fcd34d", "#fde68a", "#f472b6", "#fbbf24"];

// Small seeded PRNG so particle layout is stable for a given burst
function seeded(seed) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Floating "+N" pop-up with an amber confetti burst, shown over the canvas
// when *you* guess correctly. Purely decorative: if CSS animations are
// disabled it just vanishes after the timeout.
export default function ScoreBurst() {
  const { scoreFx } = useSocket();
  const [doneId, setDoneId] = useState(null);

  useEffect(() => {
    if (!scoreFx) return undefined;
    const t = setTimeout(() => setDoneId(scoreFx.id), 1600);
    return () => clearTimeout(t);
  }, [scoreFx]);

  const visible = scoreFx && scoreFx.id !== doneId ? scoreFx : null;

  const particles = useMemo(() => {
    if (!visible) return [];
    const rand = seeded(visible.id);
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + (rand() - 0.5) * 0.4;
      const dist = 70 + rand() * 70;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: Math.round(rand() * 360),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        delay: rand() * 0.08,
        round: i % 3 === 0,
      };
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="score-burst" key={visible.id} aria-live="polite">
      <div className="score-burst-ring" />
      {particles.map((p, i) => (
        <span
          key={i}
          className={`confetti ${p.round ? "confetti--dot" : ""}`}
          style={{
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--rot": `${p.rot}deg`,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div className="score-pop">+{visible.points}</div>
    </div>
  );
}
