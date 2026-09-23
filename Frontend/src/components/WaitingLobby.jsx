import { useState } from "react";
import { Check, Clock, Copy, Crown, LogOut, Repeat, Users, X, Zap } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import Avatar from "./ui/Avatar";
import Mascot from "./ui/Mascot";
import { ICON_SM } from "../lib/avatar";

export default function WaitingLobby() {
  const {
    roomId,
    players,
    myPlayerId,
    isHost,
    roomState,
    toggleReady,
    startGame,
    leaveRoom
  } = useSocket();

  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    try {
      navigator.clipboard?.writeText(inviteUrl)?.catch?.(() => {});
    } catch {
      /* clipboard unavailable — ignore */
    }
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const isMeReady = players.find(p => p.playerId === myPlayerId)?.isReady;
  const needMore = Math.max(0, 2 - players.length);

  return (
    <div className="waiting-lobby-container glass-panel screen-enter">
      <div className="waiting-header">
        <div>
          <h2 className="waiting-title">The Warm-up Lobby</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {isHost
              ? "You're the host — hit Start once your crew shows up."
              : "Stretch those drawing fingers. The host kicks things off."}
          </p>
        </div>

        <div className="room-invite-pill">
          <span>Code:</span>
          <strong className="invite-code">{roomId}</strong>
          <button
            type="button"
            className="glow-btn glow-btn-outline invite-copy-btn"
            onClick={copyInviteLink}
          >
            {showCopyTooltip ? <><Check {...ICON_SM} /> Copied!</> : <><Copy {...ICON_SM} /> Copy Invite Link</>}
          </button>
        </div>
      </div>

      <div className="waiting-players-grid">
        {players.map((p) => (
          <div key={p.playerId} className={`player-card glass-panel pop-in ${p.isReady ? "ready" : ""} ${p.isHost ? "host" : ""}`}>
            <Avatar name={p.username} size={60} className="player-avatar-lg" />
            <div className="player-name-lbl">
              {p.username}
              {p.playerId === myPlayerId && <span className="you-tag">you</span>}
            </div>
            <div>
              {p.isHost ? (
                <span className="badge badge-host"><Crown size={11} strokeWidth={2.75} /> Host</span>
              ) : p.isReady ? (
                <span className="badge badge-ready"><Check size={11} strokeWidth={3} /> Ready</span>
              ) : (
                <span className="badge badge-waiting"><Clock size={11} strokeWidth={2.75} /> Stretching</span>
              )}
            </div>
          </div>
        ))}

        {/* Empty seat placeholder — nudges players to invite friends */}
        {players.length < (roomState?.settings?.maxPlayers ?? 2) && (
          <button type="button" className="player-card player-card--empty" onClick={copyInviteLink}>
            <Mascot mood={needMore > 0 ? "sleep" : "idle"} size={52} />
            <div className="player-name-lbl">
              {needMore > 0 ? "Seat's empty…" : "Room for more!"}
            </div>
            <span className="empty-seat-hint">
              {needMore > 0 ? "Invite a buddy to start" : "Tap to copy invite"}
            </span>
          </button>
        )}
      </div>

      <div className="waiting-actions">
        <div className="waiting-settings">
          <span className="stat-pill"><Repeat {...ICON_SM} /> {roomState?.settings?.rounds} rounds</span>
          <span className="stat-pill"><Clock {...ICON_SM} /> {roomState?.settings?.drawTime}s to draw</span>
          <span className="stat-pill"><Users {...ICON_SM} /> {players.length}/{roomState?.settings?.maxPlayers} players</span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="glow-btn glow-btn-outline"
            onClick={leaveRoom}
          >
            <LogOut {...ICON_SM} /> Leave
          </button>

          {!isHost && (
            <button
              type="button"
              className={`glow-btn ${isMeReady ? "glow-btn-secondary" : ""}`}
              onClick={toggleReady}
            >
              {isMeReady ? <><X {...ICON_SM} /> Not ready yet</> : <><Check {...ICON_SM} /> I'm Ready!</>}
            </button>
          )}

          {isHost && (
            <button
              type="button"
              className="glow-btn glow-btn-secondary"
              disabled={players.length < 2}
              onClick={startGame}
            >
              <Zap {...ICON_SM} />
              {needMore > 0 ? `Need ${needMore} more doodler` : "Start the Chaos"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
