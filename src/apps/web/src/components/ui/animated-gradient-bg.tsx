"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGradientBackgroundProps {
  /** HTML id for anchor linking */
  id?: string;
  /** Background variant to use. 'ocean' uses much larger, blended orbs. Default: 'default' */
  variant?: 'default' | 'ocean';
  /** Array of CSS color strings to cycle through. Defaults to the brand primary-to-accent gradient. */
  colors?: string[];
  /** Animation speed in seconds for one full cycle. Default: 8 */
  speed?: number;
  /** Intensity (blur/spread) of the gradient orbs in pixels. Default: 120 */
  intensity?: number;
  /** Extra tailwind/CSS classes to merge onto the wrapper */
  className?: string;
  /** Content rendered on top of the gradient */
  children?: React.ReactNode;
}

/**
 * AnimatedGradientBackground
 *
 * Renders a live, animated multi-orb gradient behind its children.
 * All parameters are optional — defaults to the brand color palette.
 *
 * @example
 * ```tsx
 * <AnimatedGradientBackground colors={["#605BFF","#FF00AA","#00C2FF"]} speed={6} intensity={160}>
 *   <HeroContent />
 * </AnimatedGradientBackground>
 * ```
 */
export function AnimatedGradientBackground({
  id,
  variant = 'default',
  colors = ["#605BFF", "#FF00AA", "#8B5CF6"],
  speed = 8,
  intensity = 120,
  className,
  children,
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ocean variant needs larger movement paths
    const moveScale = variant === 'ocean' ? 0.3 : 0.15;

    // Derive N orb configs from the color array
    const orbs = colors.map((color, i) => {
      const angle = (i / colors.length) * Math.PI * 2;
      return {
        color,
        // Each orb has a slightly different phase & radius so they don't all move in sync
        phaseX: angle,
        phaseY: angle + Math.PI / 3,
        radiusX: 0.2 + moveScale * ((i % 3) / 2),
        radiusY: 0.15 + moveScale * ((i % 3) / 2),
        speedMultiplier: 0.7 + (i % colors.length) * 0.13,
      };
    });

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) / 1000; // seconds

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // In ocean variant, we use a larger baseline size
      const baseBlur = variant === 'ocean' 
        ? Math.max(width, height) * 0.7 
        : Math.min(width, height) * (intensity / 1000);

      // Adjust opacity based on variant to avoid saturation
      const centerAlpha = variant === 'ocean' ? '22' : 'CC';
      const midAlpha = variant === 'ocean' ? '11' : '55';

      for (const orb of orbs) {
        const cycleSecs = speed * orb.speedMultiplier;
        const t = (elapsed % cycleSecs) / cycleSecs;
        const tRad = t * Math.PI * 2;

        const cx = width * (0.5 + orb.radiusX * Math.cos(tRad + orb.phaseX));
        const cy = height * (0.5 + orb.radiusY * Math.sin(tRad + orb.phaseY));
        const blurRadius = baseBlur + (variant === 'ocean' ? width * 0.1 * Math.sin(tRad) : 0);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, blurRadius);
        grad.addColorStop(0, orb.color + centerAlpha);
        grad.addColorStop(0.5, orb.color + midAlpha);
        grad.addColorStop(1, orb.color + "00");

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, blurRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [colors, speed, intensity, variant]);

  return (
    <div id={id} className={cn("relative overflow-hidden", className)}>
      {/* Dark base to avoid harsh white flashes before paint */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
