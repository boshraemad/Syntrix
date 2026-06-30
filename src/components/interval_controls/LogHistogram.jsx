// src/components/LogHistogram.jsx
import { useRef, useEffect, useState } from "react";

export default function LogHistogram({ data, dateRange }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const PADDING = { top: 8, right: 4, bottom: 30, left: 36 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    ctx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...data.map((d) => d.count), 1);

    // Grid lines
    const gridCount = 5;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridCount; i++) {
      const y = PADDING.top + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(PADDING.left + chartW, y);
      ctx.stroke();
    }

    // Y axis labels
    ctx.fillStyle = "rgba(156,163,175,0.7)";
    ctx.font = "10px ui-sans-serif, sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridCount; i++) {
      const val = Math.round((maxVal / gridCount) * (gridCount - i));
      const y = PADDING.top + (chartH / gridCount) * i;
      if (val > 0) ctx.fillText(val, PADDING.left - 4, y + 3);
    }

    // Bars
    const barCount = data.length;
    const barW = Math.max(2, chartW / barCount - 1.5);
    data.forEach((d, i) => {
      if (d.count === 0) return;
      const barH = (d.count / maxVal) * chartH;
      const x = PADDING.left + (chartW / barCount) * i + (chartW / barCount - barW) / 2;
      const y = PADDING.top + chartH - barH;

      ctx.fillStyle = "#22c55e"; // green-500
      ctx.fillRect(x, y, barW, barH);

      // Slight highlight on top edge
      ctx.fillStyle = "rgba(134,239,172,0.4)";
      ctx.fillRect(x, y, barW, 1.5);
    });

    // X axis time labels
    ctx.fillStyle = "rgba(156,163,175,0.7)";
    ctx.font = "9px ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    const labelStep = Math.ceil(data.length / 8);
    data.forEach((d, i) => {
      if (i % labelStep !== 0) return;
      const x = PADDING.left + (chartW / barCount) * i + chartW / barCount / 2;
      ctx.fillText(d.time, x, H - PADDING.bottom + 12);
    });

    // Date below axis
    ctx.fillStyle = "rgba(156,163,175,0.5)";
    ctx.font = "9px ui-sans-serif, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("December 10, 2026", PADDING.left, H - 4);
  }, [data]);

  const getX = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const rect = canvas.getBoundingClientRect();
    return Math.max(PADDING.left, Math.min(e.clientX - rect.left, rect.width - PADDING.right));
  };

  const handleMouseDown = (e) => {
    const x = getX(e);
    setIsDragging(true);
    setSelection({ start: x, end: x });
  };

  const handleMouseMove = (e) => {
    const x = getX(e);
    if (isDragging) {
      setSelection(prev => ({ ...prev, end: x }));
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const chartW = rect.width - PADDING.left - PADDING.right;
    const idx = Math.floor(((x - PADDING.left) / chartW) * data.length);
    
    if (idx >= 0 && idx < data.length) {
      setTooltip({ x: e.clientX - rect.left, label: data[idx].time, count: data[idx].count });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Clear if it was just a click
      if (selection && Math.abs(selection.end - selection.start) < 5) {
        setSelection(null);
      }
    }
  };

  return (
    <div 
      className="relative w-full select-none" 
      style={{ height: 120 }}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setTooltip(null);
        handleMouseUp();
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
      
      {selection && Math.abs(selection.end - selection.start) > 0 && (
        <div 
          className="absolute bg-white/20 border-x border-white/40 pointer-events-none"
          style={{
            top: PADDING.top,
            height: 120 - PADDING.top - PADDING.bottom,
            left: Math.min(selection.start, selection.end),
            width: Math.abs(selection.end - selection.start)
          }}
        />
      )}

      {tooltip && tooltip.count > 0 && (
        <div
          className="absolute z-10 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 pointer-events-none"
          style={{ left: tooltip.x + 8, top: 8 }}
        >
          <span className="text-green-400 font-semibold">{tooltip.count}</span>{" "}
          <span className="text-gray-400">at {tooltip.label}</span>
        </div>
      )}
    </div>
  );
}
