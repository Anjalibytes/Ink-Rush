// Circular countdown ring for the round timer.
// Falls back to a plain number if the total draw time is unknown.
export default function TimerRing({ timeLeft = 0, total = 0, active = true, size = 54 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const safeTotal = total > 0 ? total : Math.max(timeLeft, 1);
  const progress = active ? Math.min(1, Math.max(0, timeLeft / safeTotal)) : 1;

  let tone = "calm";
  if (active && timeLeft > 0 && timeLeft <= 10) tone = "hurry";
  else if (active && progress <= 0.35) tone = "warn";

  return (
    <div
      className={`timer-ring timer-ring--${tone}`}
      style={{ width: size, height: size }}
      role="timer"
      aria-label={`${timeLeft} seconds left`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="timer-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className="timer-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span key={timeLeft} className="timer-ring-value">{timeLeft}</span>
    </div>
  );
}
