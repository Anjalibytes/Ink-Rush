import { Crown, LogOut, RotateCcw, Trophy } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";
import Mascot from "../ui/Mascot";
import { ICON_SM } from "../../lib/avatar";

function PodiumPlace({ player, place }) {
  const label = { first: "1st", second: "2nd", third: "3rd" }[place];
  return (
    <div className={`podium-place ${place}`}>
      {place === "first" && <Crown size={20} strokeWidth={2.5} className="crown-icon" />}
      <Avatar name={player.username} size={place === "first" ? 40 : 32} />
      <span className="podium-name">{player.username}</span>
      <span className="podium-score">{player.score} pts</span>
      <div className="podium-bar">{label}</div>
    </div>
  );
}

export default function GameOverModal({ leaving = false }) {
  const { players, isHost, playAgain, leaveRoom } = useSocket();

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={`overlay-container ${leaving ? "is-leaving" : ""}`}>
      <div className="modal-card glass-panel">
        <Mascot mood="cheer" size={72} />
        <h2>InkRush Hall of Fame</h2>

        {sortedPlayers.length > 0 && (
          <p className="winner-line">
            <Trophy size={22} strokeWidth={2.5} /> {sortedPlayers[0].username} takes the crown!
          </p>
        )}

        <div className="podium-container">
          {/* 2nd place */}
          {sortedPlayers[1] && <PodiumPlace player={sortedPlayers[1]} place="second" />}
          {/* 1st place */}
          {sortedPlayers[0] && <PodiumPlace player={sortedPlayers[0]} place="first" />}
          {/* 3rd place */}
          {sortedPlayers[2] && <PodiumPlace player={sortedPlayers[2]} place="third" />}
        </div>

        <div className="final-standings">
          {sortedPlayers.map((p, idx) => (
            <div key={p.playerId} className="standing-row standing-row--boxed">
              <span className="standing-name">
                <span className="standing-rank">#{idx + 1}</span>
                <Avatar name={p.username} size={22} />
                {p.username}
              </span>
              <span>{p.score} pts</span>
            </div>
          ))}
        </div>

        {isHost ? (
          <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
            <button type="button" className="glow-btn" onClick={playAgain} style={{ flex: 1 }}>
              <RotateCcw {...ICON_SM} /> Run it back
            </button>
            <button type="button" className="glow-btn glow-btn-secondary" onClick={leaveRoom} style={{ flex: 1 }}>
              <LogOut {...ICON_SM} /> Leave
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
            <button type="button" className="glow-btn glow-btn-secondary" onClick={leaveRoom} style={{ width: "100%" }}>
              <LogOut {...ICON_SM} /> Leave
            </button>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center" }}>
              Hang tight — the host decides if we go again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
