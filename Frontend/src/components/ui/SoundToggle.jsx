import { Volume2, VolumeX } from "lucide-react";
import { setMuted, useMuted } from "../../lib/sound";
import { ICON } from "../../lib/avatar";

export default function SoundToggle() {
  const muted = useMuted();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setMuted(!muted)}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      aria-pressed={muted}
    >
      {muted ? <VolumeX {...ICON} /> : <Volume2 {...ICON} />}
    </button>
  );
}
