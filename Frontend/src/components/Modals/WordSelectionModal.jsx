import { useState } from "react";
import { Timer } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import Mascot from "../ui/Mascot";
import { ICON_SM } from "../../lib/avatar";

export default function WordSelectionModal({ leaving = false }) {
  const { isDrawer, wordOptions, chooseWord, roomState } = useSocket();
  const [clickedWord, setClickedWord] = useState(null);

  const handlePick = (word) => {
    if (clickedWord) return; // prevent duplicate clicks
    setClickedWord(word);

    // Highlight and wait 3 seconds before emitting socket word selection
    setTimeout(() => {
      chooseWord(word);
    }, 3000);
  };

  const drawerName =
    roomState?.players?.find(p => p.playerId === roomState?.currentDrawer)?.username || "The artist";

  return (
    <div className={`overlay-container ${leaving ? "is-leaving" : ""}`}>
      <div className="modal-card glass-panel" style={{ maxWidth: "420px" }}>
        {isDrawer ? (
          <>
            <Mascot mood="cheer" size={64} />
            <h2>Pick your masterpiece</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Choose wisely — everyone's about to watch you draw it.
            </p>
            <div className="word-options-list">
              {wordOptions.map((opt, i) => (
                <button
                  type="button"
                  key={opt}
                  className={`word-option-btn stagger-in ${clickedWord === opt ? "highlight-pulse" : ""}`}
                  style={{
                    animationDelay: `${i * 70}ms`,
                    ...(clickedWord && clickedWord !== opt ? { opacity: 0.5, transform: "none", pointerEvents: "none" } : {})
                  }}
                  disabled={clickedWord !== null}
                  onClick={() => handlePick(opt)}
                >
                  {opt}
                  {clickedWord === opt && (
                    <span className="word-option-starting"><Timer {...ICON_SM} /> Get ready…</span>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <Mascot mood="think" size={80} />
            <h2>Word incoming…</h2>
            <p style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--color-secondary-light)" }}>{drawerName}</strong> is picking a word. No peeking!
            </p>
            <div className="dot-loader" aria-hidden="true"><span /><span /><span /></div>
          </>
        )}
      </div>
    </div>
  );
}
