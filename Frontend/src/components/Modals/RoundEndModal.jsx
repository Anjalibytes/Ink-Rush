import { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";
import Mascot from "../ui/Mascot";

export default function RoundEndModal({ leaving = false }) {
  const { chosenWordReveal, players } = useSocket();

  // Remember the revealed word so it stays visible during the exit animation
  // (the next round clears chosenWordReveal right away).
  const [revealedWord] = useState(chosenWordReveal);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={`overlay-container ${leaving ? "is-leaving" : ""}`}>
      <div className="modal-card glass-panel" style={{ maxWidth: "420px" }}>
        <Mascot mood="idle" size={64} />
        <h2>Pencils down!</h2>
        <p style={{ color: "var(--text-muted)" }}>The word was…</p>
        <div className="transition-word-reveal">{revealedWord || chosenWordReveal}</div>

        <div style={{ width: "100%", borderTop: "1px solid var(--border-color)", padding: "16px 0 0" }}>
          <h4 style={{ marginBottom: "12px", textTransform: "uppercase", fontSize: "13px", color: "var(--text-muted)" }}>
            Standings so far
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sortedPlayers.slice(0, 5).map((p, i) => (
              <div key={p.playerId} className="standing-row stagger-in" style={{ animationDelay: `${120 + i * 60}ms` }}>
                <span className="standing-name">
                  <Avatar name={p.username} size={24} />
                  {p.username}
                </span>
                <span><strong>{p.score} pts</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
