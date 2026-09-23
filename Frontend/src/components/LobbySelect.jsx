import { useState, useEffect } from "react";
import { Gamepad2, Loader2, LogIn, PlusCircle, Rocket, ScrollText, Zap } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import Mascot from "./ui/Mascot";
import { ICON, ICON_SM } from "../lib/avatar";

export default function LobbySelect() {
  const {
    tab,
    setTab,
    roomId,
    setRoomId,
    connectAndAction,
    joinPublicRoom,
    errorMsg,
    setErrorMsg
  } = useSocket();

  const [localUsername, setLocalUsername] = useState("");
  
  // Room Configuration states
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [rounds, setRounds] = useState(3);
  const [drawTime, setDrawTime] = useState(60);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [wordMode, setWordMode] = useState("NORMAL");
  const [lobbyType, setLobbyType] = useState("PRIVATE");

  const [loadingType, setLoadingType] = useState(null); // 'spawn', 'enter', 'quickplay', or null

  // Reset loading indicators if the server returns a joining/spawning error
  useEffect(() => {
    if (errorMsg) {
      setLoadingType(null);
    }
  }, [errorMsg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localUsername || localUsername.trim() === "") {
      setErrorMsg("Please enter a username.");
      return;
    }
    setErrorMsg("");
    setLoadingType(tab === "join" ? "enter" : "spawn");
    
    // Calls context function which handles connecting and emitting create/join events
    connectAndAction(
      localUsername.trim(),
      tab,
      maxPlayers,
      rounds,
      drawTime,
      hintsEnabled,
      wordMode,
      lobbyType
    );
  };

  const handleQuickPlay = (e) => {
    e.preventDefault();
    if (!localUsername || localUsername.trim() === "") {
      setErrorMsg("Please enter a username for Quick Play.");
      return;
    }
    setErrorMsg("");
    setLoadingType("quickplay");
    joinPublicRoom(localUsername.trim());
  };

  return (
    <div className="lobby-container-vertical screen-enter">
      {/* Top Center Banner */}
      <div className="lobby-banner">
        <div className="hero-logo">
          <Mascot mood="idle" size={92} />
        </div>
        <h1 className="hero-title">InkRush</h1>
        <p className="hero-subtitle">
          The ultimate real-time multiplayer pictionary challenge.
        </p>
      </div>

      {/* Side-by-Side Content Grid */}
      <div className="lobby-grid">
        {/* Left Column: Join/Create Form panel */}
        <div className="lobby-form-panel glass-panel">
          <div className="lobby-tab-container">
            <button
              type="button"
              className={`lobby-tab ${tab === "join" ? "active" : ""}`}
              onClick={() => { setTab("join"); setErrorMsg(""); }}
            >
              <LogIn {...ICON_SM} /> Join Room
            </button>
            <button
              type="button"
              className={`lobby-tab ${tab === "create" ? "active" : ""}`}
              onClick={() => { setTab("create"); setErrorMsg(""); }}
            >
              <PlusCircle {...ICON_SM} /> Create Room
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">What should we call you?</label>
              <input
                type="text"
                maxLength={12}
                className="glow-input"
                placeholder="e.g. Pablo Pic-asso"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
            </div>

            {tab === "join" ? (
              <div className="form-group">
                <label className="form-label">Enter Room Code</label>
                <input
                  type="text"
                  maxLength={6}
                  className="glow-input"
                  style={{ textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "2px" }}
                  placeholder="e.g. AX7Y9P"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Room Configuration</label>
                <div className="settings-grid">
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Rounds</span>
                    <select
                      className="settings-select"
                      value={rounds}
                      onChange={(e) => setRounds(parseInt(e.target.value))}
                    >
                      <option value={2}>2 Rounds</option>
                      <option value={3}>3 Rounds</option>
                      <option value={5}>5 Rounds</option>
                      <option value={10}>10 Rounds</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Draw Time</span>
                    <select
                      className="settings-select"
                      value={drawTime}
                      onChange={(e) => setDrawTime(parseInt(e.target.value))}
                    >
                      <option value={30}>30 Secs</option>
                      <option value={45}>45 Secs</option>
                      <option value={60}>60 Secs</option>
                      <option value={90}>90 Secs</option>
                      <option value={120}>120 Secs</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Max Players</span>
                    <select
                      className="settings-select"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  >
                      <option value={2}>2 Players</option>
                      <option value={5}>5 Players</option>
                      <option value={8}>8 Players</option>
                      <option value={12}>12 Players</option>
                      <option value={20}>20 Players</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Hints</span>
                    <select
                      className="settings-select"
                      value={hintsEnabled ? "yes" : "no"}
                      onChange={(e) => setHintsEnabled(e.target.value === "yes")}
                    >
                      <option value="yes">Enabled</option>
                      <option value="no">Disabled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Word Mode</span>
                    <select
                      className="settings-select"
                      value={wordMode}
                      onChange={(e) => setWordMode(e.target.value)}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIDDEN">Hidden</option>
                      <option value="COMBINATION">Combination</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: "11px" }}>Lobby Type</span>
                    <select
                      className="settings-select"
                      value={lobbyType}
                      onChange={(e) => setLobbyType(e.target.value)}
                    >
                      <option value="PRIVATE">Private (Invite)</option>
                      <option value="PUBLIC">Public (Matchmaking)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {tab === "join" ? (
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="glow-btn" style={{ flex: 1 }} disabled={loadingType !== null}>
                  {loadingType === "enter" ? (
                    <><Loader2 {...ICON_SM} className="spin" /> Sharpening pencils…</>
                  ) : (
                    <><Rocket {...ICON_SM} /> Enter Arena</>
                  )}
                </button>
                <button type="button" className="glow-btn glow-btn-secondary" style={{ flex: 1 }} onClick={handleQuickPlay} disabled={loadingType !== null}>
                  {loadingType === "quickplay" ? (
                    <><Loader2 {...ICON_SM} className="spin" /> Finding you a table…</>
                  ) : (
                    <><Gamepad2 {...ICON_SM} /> Quick Play</>
                  )}
                </button>
              </div>
            ) : (
              <button type="submit" className="glow-btn" style={{ marginTop: "8px", width: "100%" }} disabled={loadingType !== null}>
                {loadingType === "spawn" ? (
                  <><Loader2 {...ICON_SM} className="spin" /> Unrolling fresh paper…</>
                ) : (
                  <><Zap {...ICON_SM} /> Spawn Room</>
                )}
              </button>
            )}
          </form>
        </div>

        {/* Right Column: How to Play & Rules Guidelines panel */}
        <div className="lobby-rules-panel glass-panel">
          <h3 className="guide-header title-with-icon"><Gamepad2 {...ICON} /> How to Play</h3>
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-num">1</div>
              <div>
                <strong>Pick & Draw:</strong> Grab a secret word and sketch it — stick figures totally count.
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">2</div>
              <div>
                <strong>Guess:</strong> Blurt guesses into chat. Faster guesses = fatter points.
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">3</div>
              <div>
                <strong>Win:</strong> Top the board when the last round ends and the crown is yours!
              </div>
            </div>
          </div>

          <h3 className="guide-header title-with-icon" style={{ marginTop: "8px" }}><ScrollText {...ICON} /> House Rules</h3>
          <ul className="guide-rules-list">
            <li>No writing letters or numbers on the canvas — that's cheating, Picasso.</li>
            <li>Keep the chat friendly. Roast the drawings, not the people.</li>
            <li>Feeling brave? Try Hidden or Combination word modes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
