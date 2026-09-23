import { useEffect, useState } from "react";
import { CheckCircle2, Pencil, Users, WifiOff } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import Avatar from "./ui/Avatar";
import Mascot from "./ui/Mascot";
import { ICON, ICON_SM } from "../lib/avatar";

export default function LeaderboardSidebar() {
  const { players, myPlayerId } = useSocket();

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Track score increases so rows can pulse and show a "+N" when anyone scores
  const [prevPlayers, setPrevPlayers] = useState(players);
  const [bumps, setBumps] = useState({});

  if (players !== prevPlayers) {
    const prevScores = Object.fromEntries(prevPlayers.map((p) => [p.playerId, p.score]));
    const next = {};
    players.forEach((p) => {
      const prev = prevScores[p.playerId];
      if (prev !== undefined && p.score > prev) {
        next[p.playerId] = { delta: p.score - prev, id: `${p.playerId}-${p.score}` };
      }
    });
    setPrevPlayers(players);
    if (Object.keys(next).length > 0) setBumps((b) => ({ ...b, ...next }));
  }

  useEffect(() => {
    if (Object.keys(bumps).length === 0) return undefined;
    const t = setTimeout(() => setBumps({}), 1500);
    return () => clearTimeout(t);
  }, [bumps]);

  return (
    <aside className="game-scoreboard glass-panel">
      <h3 className="scoreboard-title">
        <span className="title-with-icon"><Users {...ICON} /> Players</span>
        <span className="scoreboard-count">
          {players.length} {players.length === 1 ? "doodler" : "doodlers"}
        </span>
      </h3>

      {sortedPlayers.length === 0 ? (
        <div className="empty-state">
          <Mascot mood="sleep" size={64} />
          <p>It's quiet… too quiet. Nobody's on the board yet.</p>
        </div>
      ) : (
        <div className="scoreboard-list">
          {sortedPlayers.map((p, idx) => {
            const bump = bumps[p.playerId];
            return (
              <div
                key={p.playerId}
                className={`scoreboard-item ${p.isDrawer ? "drawing" : ""} ${p.hasGuessedCorrectly ? "guessed-correctly" : ""} ${!p.connected ? "disconnected" : ""} ${bump ? "score-bump" : ""}`}
              >
                <span className={`item-rank rank-${idx + 1}`}>#{idx + 1}</span>
                <Avatar name={p.username} size={34} drawing={p.isDrawer} />
                <div className="item-info">
                  <div className="item-name">
                    {p.username}
                    {p.playerId === myPlayerId && <span className="you-tag">you</span>}
                  </div>
                  <div className="item-score">{p.score} pts</div>
                </div>
                <div className="item-status-icon">
                  {p.isDrawer && <Pencil {...ICON_SM} className="status-drawing" aria-label="Drawing" />}
                  {p.hasGuessedCorrectly && <CheckCircle2 {...ICON_SM} className="status-correct" aria-label="Guessed it" />}
                  {!p.connected && <WifiOff {...ICON_SM} className="status-offline" aria-label="Disconnected" />}
                </div>
                {bump && (
                  <span key={bump.id} className="row-score-pop">+{bump.delta}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
