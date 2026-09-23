import { useEffect } from "react";
import { AlertTriangle, LogOut, Repeat, Tag, Type } from "lucide-react";
import { SocketProvider, useSocket } from "./context/SocketContext.jsx";
import LobbySelect from "./components/LobbySelect.jsx";
import WaitingLobby from "./components/WaitingLobby.jsx";
import LeaderboardSidebar from "./components/LeaderboardSidebar.jsx";
import CanvasBoard from "./components/CanvasBoard.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import WordSelectionModal from "./components/Modals/WordSelectionModal.jsx";
import RoundEndModal from "./components/Modals/RoundEndModal.jsx";
import GameOverModal from "./components/Modals/GameOverModal.jsx";
import Presence from "./components/ui/Presence.jsx";
import TimerRing from "./components/ui/TimerRing.jsx";
import SoundToggle from "./components/ui/SoundToggle.jsx";
import ScoreBurst from "./components/ui/ScoreBurst.jsx";
import DoodleBackdrop from "./components/ui/DoodleBackdrop.jsx";
import { ICON, ICON_SM } from "./lib/avatar.js";
import { sound } from "./lib/sound.js";
import "./App.css";

function GameRoom() {
  const { roomState, isDrawer, chosenWordReveal, hints, category, wordLength, timeLeft, leaveRoom } = useSocket();
  const state = roomState?.state;
  const isDrawing = state === "DRAWING";

  // Subtle tick during the final 10 seconds of a drawing round
  useEffect(() => {
    if (isDrawing && timeLeft > 0 && timeLeft <= 10) {
      sound.tick(timeLeft <= 3);
    }
  }, [timeLeft, isDrawing]);

  const wordShown = isDrawer ? chosenWordReveal : hints;

  return (
    <div className="game-container screen-enter">
      {/* Modals & Overlays based on state (with enter/exit transitions) */}
      <Presence show={state === "GAME_OVER"}>{(leaving) => <GameOverModal leaving={leaving} />}</Presence>
      <Presence show={state === "WORD_SELECTION"}>{(leaving) => <WordSelectionModal leaving={leaving} />}</Presence>
      <Presence show={state === "ROUND_END"}>{(leaving) => <RoundEndModal leaving={leaving} />}</Presence>

      {/* Correct-guess celebration — top layer so it shows even as the round-end card appears */}
      <ScoreBurst />

      {/* Left Column: Player Scoreboard Sidebar */}
      <LeaderboardSidebar />

      {/* Center Column: Game HUD, Canvas Drawing board, Toolbar */}
      <main className="game-play-area">
        <div className="game-hud glass-panel">
          <div className="hud-info">
            <TimerRing timeLeft={timeLeft} total={roomState?.settings?.drawTime} active={isDrawing} />
            <div className="hud-word-display">
              <div key={wordShown || "empty"} className="hud-masked-word hint-pop">
                {wordShown || (isDrawing ? "" : "· · ·")}
              </div>
              <div className="hud-word-hint">
                {category && (
                  <span className="hud-hint-item">
                    <Tag {...ICON_SM} /> <strong>{category}</strong>
                  </span>
                )}
                {wordLength > 0 && (
                  <span className="hud-hint-item">
                    <Type {...ICON_SM} /> <strong>{wordLength} letters</strong>
                  </span>
                )}
                {isDrawer && isDrawing && <span className="hud-hint-item hud-your-turn">Your turn to draw!</span>}
              </div>
            </div>
          </div>

          <div className="hud-actions">
            <span className="stat-pill">
              <Repeat {...ICON_SM} />
              Round {roomState?.currentRound} / {roomState?.settings?.rounds}
            </span>
            <SoundToggle />
            <button
              type="button"
              className="glow-btn glow-btn-secondary hud-leave-btn"
              onClick={leaveRoom}
            >
              <LogOut {...ICON_SM} /> Leave
            </button>
          </div>
        </div>

        {/* Scaled Canvas Board and drawing tools */}
        <CanvasBoard />
      </main>

      {/* Right Column: Chat logging stream and guess submission forms */}
      <ChatPanel />
    </div>
  );
}

function AppContent() {
  const { screen, errorMsg } = useSocket();

  return (
    <div className="App">
      {errorMsg && (
        <div className="glass-panel error-banner" role="alert">
          <AlertTriangle {...ICON} />
          <p>{errorMsg}</p>
        </div>
      )}

      {screen === "LOBBY_SELECT" && <LobbySelect />}
      {screen === "WAITING_LOBBY" && <WaitingLobby />}
      {screen === "GAME_PLAY" && <GameRoom />}
    </div>
  );
}

export default function App() {
  return (
    <SocketProvider>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <DoodleBackdrop />
      <AppContent />
    </SocketProvider>
  );
}
