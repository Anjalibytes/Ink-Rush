import { useMemo } from "react";
import { Brush, Eraser, Pencil, Trash2, Undo2, Eye } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useCanvas } from "../hooks/useCanvas";
import { ICON_SM } from "../lib/avatar";

// Color Palette for Drawer
const COLORS = [
  "#000000", // Black
  "#ffffff", // White
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#78350f"  // Brown
];

const BRUSH_SIZES = [
  { size: 2, dot: 4, label: "Thin Brush" },
  { size: 6, dot: 8, label: "Medium Brush" },
  { size: 12, dot: 14, label: "Thick Brush" },
  { size: 24, dot: 20, label: "Huge Brush" },
];

// Build a crayon/pencil cursor whose tip matches the selected color.
// Hotspot is the pencil tip (bottom-left). Browsers that reject the image
// fall back to the "crosshair" keyword listed after it.
function pencilCursor(color) {
  const tip = color.toLowerCase() === "#ffffff" ? "#e5e7eb" : color;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
    <g stroke='#1f1633' stroke-width='1.6' stroke-linejoin='round'>
      <path d='M8.5 19.5 L20.5 7.5 L24.5 11.5 L12.5 23.5 Z' fill='#fbbf24'/>
      <path d='M20.5 7.5 L22.5 5.5 Q24 4 25.5 5.5 L26.5 6.5 Q28 8 26.5 9.5 L24.5 11.5 Z' fill='#f472b6'/>
      <path d='M8.5 19.5 L12.5 23.5 L3 26 Z' fill='#fde2b8'/>
    </g>
    <path d='M3 26 L4.2 21.6 L7.4 24.8 Z' fill='${tip}' stroke='#1f1633' stroke-width='1'/>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 25, crosshair`;
}

function eraserCursor() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
    <g stroke='#1f1633' stroke-width='1.6' stroke-linejoin='round'>
      <path d='M4 18 L15 7 L23 15 L12 26 L8 26 Z' fill='#f9a8d4'/>
      <path d='M4 18 L9 13 L17 21 L12 26 L8 26 Z' fill='#ffffff'/>
    </g>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 6 24, cell`;
}

export default function CanvasBoard() {
  const { isDrawer, roomState } = useSocket();
  const {
    canvasRef,
    drawColor,
    setDrawColor,
    brushSize,
    setBrushSize,
    activeTool,
    setActiveTool,
    startDrawing,
    drawMove,
    endDrawing,
    undoDraw,
    clearDraw
  } = useCanvas(isDrawer, roomState?.state);

  const canDraw = isDrawer && roomState?.state === "DRAWING";
  const drawerName = roomState?.players?.find((p) => p.playerId === roomState?.currentDrawer)?.username;

  const cursor = useMemo(() => {
    if (!canDraw) return "default";
    return activeTool === "eraser" ? eraserCursor() : pencilCursor(drawColor);
  }, [canDraw, activeTool, drawColor]);

  return (
    <>
      {/* Drawing Canvas Frame */}
      <div className={`canvas-wrapper ${canDraw ? "is-my-turn" : ""}`}>
        <canvas
          ref={canvasRef}
          className="canvas-element"
          style={{ cursor }}
          onMouseDown={startDrawing}
          onMouseMove={drawMove}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />

        {drawerName && roomState?.state === "DRAWING" && (
          <div className="canvas-drawer-tag">
            {isDrawer ? <Pencil {...ICON_SM} /> : <Eye {...ICON_SM} />}
            {isDrawer ? "You're drawing" : `${drawerName} is drawing`}
          </div>
        )}

      </div>

      {/* Drawer Drawing Toolbar */}
      <div className="canvas-toolbar glass-panel" style={{ visibility: isDrawer ? "visible" : "hidden" }}>
        <div className="toolbar-group">
          <span className="form-label toolbar-label">
            <Brush {...ICON_SM} /> Color
          </span>
          <div className="color-swatch-list">
            {COLORS.map((col) => (
              <button
                type="button"
                key={col}
                aria-label={`Color ${col}`}
                className={`color-swatch ${drawColor === col && activeTool === "brush" ? "active" : ""}`}
                style={{ backgroundColor: col }}
                onClick={() => {
                  setDrawColor(col);
                  setActiveTool("brush");
                }}
              />
            ))}
          </div>
        </div>

        <div className="toolbar-group">
          {BRUSH_SIZES.map(({ size, dot, label }) => (
            <button
              key={size}
              type="button"
              className={`brush-size-btn ${brushSize === size ? "active" : ""}`}
              onClick={() => setBrushSize(size)}
              title={label}
              aria-label={label}
            >
              <div className="brush-indicator" style={{ width: `${dot}px`, height: `${dot}px` }} />
            </button>
          ))}
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={`glow-btn glow-btn-outline tool-btn ${activeTool === "eraser" ? "glow-btn-secondary" : ""}`}
            onClick={() => setActiveTool(activeTool === "eraser" ? "brush" : "eraser")}
          >
            <Eraser {...ICON_SM} /> Eraser
          </button>
          <button
            type="button"
            className="glow-btn glow-btn-outline tool-btn"
            onClick={undoDraw}
          >
            <Undo2 {...ICON_SM} /> Undo
          </button>
          <button
            type="button"
            className="glow-btn glow-btn-outline tool-btn"
            onClick={clearDraw}
          >
            <Trash2 {...ICON_SM} /> Clear
          </button>
        </div>
      </div>
    </>
  );
}
