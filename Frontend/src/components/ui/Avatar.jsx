import { Pencil } from "lucide-react";
import { avatarColor, initials } from "../../lib/avatar";

// Initials-on-colored-circle avatar. The current drawer gets a pink glow
// ring plus a little pencil badge.
export default function Avatar({ name = "", size = 32, drawing = false, className = "" }) {
  return (
    <span
      className={`avatar ${drawing ? "avatar--drawing" : ""} ${className}`}
      style={{
        background: avatarColor(name),
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
      }}
      title={name}
      aria-hidden="true"
    >
      {initials(name)}
      {drawing && (
        <span className="avatar-badge">
          <Pencil size={Math.max(9, Math.round(size * 0.32))} strokeWidth={2.75} />
        </span>
      )}
    </span>
  );
}
