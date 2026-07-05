"use client";

import React, { useEffect, useRef } from "react";

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Characters from Atom Automation branding
    const chars = "ATOMAUTOMATION0101".split("");
    const fontSize = 14;
    ctx.font = `bold ${fontSize}px monospace`;

    const columns = Math.floor(window.innerWidth / fontSize) + 1;
    const yPositions = Array(columns).fill(0).map(() => Math.floor(Math.random() * -100));

    // Curated Atom theme colors: Red variations (#D8524B) and Yellow variations (#FFD700)
    const colors = ["#D8524B", "#E57373", "#FFFFA7", "#FFD700", "#FFB74D"];

    let lastTime = 0;
    const fps = 24; // Limit frames per second to reduce CPU usage and make text readable
    const interval = 1000 / fps;
    let animationId: number;

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      const delta = timestamp - lastTime;
      if (delta < interval) return;
      lastTime = timestamp - (delta % interval);

      // Clear with semi-transparent ghost white (#F8F8FF) for decay trail
      ctx.fillStyle = "rgba(248, 248, 255, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < yPositions.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = yPositions[i] * fontSize;

        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          yPositions[i] = 0;
        } else {
          yPositions[i]++;
        }
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none z-0"
    />
  );
};
