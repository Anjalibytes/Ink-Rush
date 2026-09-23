import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Flame, Lock, MessageCircle, SendHorizontal, Sparkles } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import Avatar from "./ui/Avatar";
import Mascot from "./ui/Mascot";
import { ICON, ICON_SM } from "../lib/avatar";

export default function ChatPanel() {
  const {
    chatMessages,
    isDrawer,
    hasGuessedCorrectly,
    sendGuess,
    sendMessage,
    roomState,
    wrongGuessKey
  } = useSocket();

  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);
  const formRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Gentle, non-punishing shake on a missed guess (restarts on every miss)
  useEffect(() => {
    const form = formRef.current;
    if (!wrongGuessKey || !form) return;
    form.classList.remove("shake");
    void form.offsetWidth; // reflow so the animation can replay
    form.classList.add("shake");
  }, [wrongGuessKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput || chatInput.trim() === "") return;

    if (roomState?.state === "DRAWING" && !isDrawer && !hasGuessedCorrectly) {
      sendGuess(chatInput.trim());
    } else {
      sendMessage(chatInput.trim());
    }

    setChatInput("");
  };

  const systemIcon = (msg) => {
    if (msg.guessCorrect) return <CheckCircle2 {...ICON_SM} />;
    if (msg.isCloseWarning) return <Flame {...ICON_SM} />;
    return <Sparkles {...ICON_SM} />;
  };

  return (
    <aside className="game-chat-panel glass-panel">
      <div className="chat-header title-with-icon">
        <MessageCircle {...ICON} /> Guesses & Chatter
      </div>
      <div className="chat-messages">
        {chatMessages.length === 0 && (
          <div className="empty-state">
            <Mascot mood="sleep" size={60} />
            <p>Crickets… Be the first to throw out a wild guess!</p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${
              msg.system
                ? msg.guessCorrect
                  ? "correct"
                  : msg.isCloseWarning
                    ? "warning"
                    : "system"
                : msg.specialGroup === "correct"
                  ? "correct"
                  : msg.isDrawer
                    ? "drawer"
                    : "normal"
            }`}
          >
            {msg.system ? (
              <span className="chat-msg-text chat-system-line">
                <span className="chat-system-icon">{systemIcon(msg)}</span>
                {msg.text}
              </span>
            ) : (
              <>
                <Avatar name={msg.playerName} size={22} drawing={msg.isDrawer} className="chat-avatar" />
                <div className="chat-msg-body">
                  <span className="chat-msg-sender">{msg.playerName}</span>
                  <span className="chat-msg-text">
                    {msg.specialGroup === "correct" && (
                      <span className="chat-private-tag"><Lock size={11} strokeWidth={2.5} /> winners only</span>
                    )}
                    {msg.text}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="chat-input-form" onAnimationEnd={(e) => e.currentTarget.classList.remove("shake")}>
        <input
          type="text"
          className="chat-input"
          placeholder={
            isDrawer
              ? "You're the artist — no spoilers!"
              : hasGuessedCorrectly
                ? "Nailed it! Chat with fellow geniuses…"
                : "Type your guess…"
          }
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={isDrawer}
          autoComplete="off"
        />
        <button
          type="submit"
          className="glow-btn chat-send-btn"
          disabled={isDrawer}
          aria-label="Send"
        >
          <SendHorizontal {...ICON_SM} />
        </button>
      </form>
    </aside>
  );
}
