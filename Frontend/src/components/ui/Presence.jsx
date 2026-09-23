import { useEffect, useState } from "react";

// Keeps a child mounted for a short exit animation after `show` turns false.
// Children is a render function receiving `leaving` so the child can add its
// own exit class (no wrapper element — keeps the grid layout untouched).
// If timers or animations misbehave, the worst case is an instant swap.
export default function Presence({ show, duration = 240, children }) {
  const [mounted, setMounted] = useState(show);

  // Mount immediately when shown (render-phase state adjustment)
  if (show && !mounted) setMounted(true);

  // Unmount after the exit animation has had time to play
  useEffect(() => {
    if (show || !mounted) return undefined;
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [show, mounted, duration]);

  if (!mounted && !show) return null;
  return children(mounted && !show);
}
