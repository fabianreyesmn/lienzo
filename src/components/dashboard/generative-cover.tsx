
"use client";

import { useMemo } from 'react';

// Simple hash function to convert a string to a number
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Patterns now use CSS variables from the theme
const patterns = [
  // Pattern 1: Intersecting Circles using primary, accent, and background
  (seed: number) => ({
    backgroundColor: 'hsl(var(--card))',
    backgroundImage: `
      radial-gradient(circle at top left, hsl(var(--primary) / 0.5), transparent 60%),
      radial-gradient(circle at bottom right, hsl(var(--accent) / 0.5), transparent 60%),
      radial-gradient(circle at top right, hsl(var(--secondary)), transparent 60%)
    `,
  }),
  // Pattern 2: Diagonal Stripes using secondary and card background
  (seed: number) => {
    const angle = (seed % 9) * 10 + 40;
    return {
      backgroundColor: 'hsl(var(--card))',
      backgroundImage: `repeating-linear-gradient(${angle}deg, hsl(var(--secondary)), hsl(var(--secondary)) 10px, hsl(var(--card)) 10px, hsl(var(--card)) 20px)`,
    };
  },
  // Pattern 3: Polka Dots using primary color
  (seed: number) => {
    const size = (seed % 5) + 8; // 8px to 12px
    return {
      backgroundColor: 'hsl(var(--card))',
      backgroundImage: `radial-gradient(hsl(var(--primary) / 0.7) 20%, transparent 20%)`,
      backgroundSize: `${size * 4}px ${size * 4}px`,
    };
  },
  // Pattern 4: Gradients using primary, secondary, and accent
  (seed: number) => {
    const angle = (seed % 18) * 20;
    return {
      backgroundImage: `linear-gradient(${angle}deg, hsl(var(--primary) / 0.8), hsl(var(--accent) / 0.8), hsl(var(--secondary)))`,
    };
  },
];

export function GenerativeCover({ projectId }: { projectId: string }) {
  const style = useMemo(() => {
    const seed = simpleHash(projectId);
    const patternIndex = seed % patterns.length;
    return patterns[patternIndex](seed);
  }, [projectId]);

  return (
    <div
      aria-hidden="true"
      className="w-full h-32 bg-muted overflow-hidden"
      style={style}
    />
  );
}
