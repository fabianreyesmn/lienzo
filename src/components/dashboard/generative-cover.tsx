
"use client";

import { useMemo } from 'react';

interface GenerativeCoverProps {
  projectId: string;
}

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

const patterns = [
  // Pattern 1: Intersecting Circles
  (seed: number) => {
    const color1 = `hsl(${seed % 360}, 70%, 85%)`;
    const color2 = `hsl(${(seed + 120) % 360}, 70%, 85%)`;
    const color3 = `hsl(${(seed + 240) % 360}, 70%, 85%)`;
    return {
      backgroundColor: `hsl(${seed % 360}, 50%, 98%)`,
      backgroundImage: `
        radial-gradient(circle at top left, ${color1}, transparent 60%),
        radial-gradient(circle at bottom right, ${color2}, transparent 60%),
        radial-gradient(circle at top right, ${color3}, transparent 60%)
      `,
    };
  },
  // Pattern 2: Diagonal Stripes
  (seed: number) => {
    const angle = (seed % 9) * 10 + 40;
    const color1 = `hsl(${seed % 360}, 60%, 90%)`;
    const color2 = `hsl(${(seed + 60) % 360}, 60%, 95%)`;
    return {
      backgroundColor: color2,
      backgroundImage: `repeating-linear-gradient(${angle}deg, ${color1}, ${color1} 10px, ${color2} 10px, ${color2} 20px)`,
    };
  },
  // Pattern 3: Polka Dots
  (seed: number) => {
    const size = (seed % 5) + 8; // 8px to 12px
    const color1 = `hsl(${(seed) % 360}, 70%, 88%)`;
    const color2 = `hsl(${(seed + 180) % 360}, 20%, 98%)`;
    return {
        backgroundColor: color2,
        backgroundImage: `radial-gradient(${color1} 20%, transparent 20%)`,
        backgroundSize: `${size * 4}px ${size * 4}px`,
    }
  },
    // Pattern 4: Gradients
  (seed: number) => {
    const angle = (seed % 18) * 20;
    const color1 = `hsl(${seed % 360}, 100%, 92%)`;
    const color2 = `hsl(${(seed + 90) % 360}, 100%, 92%)`;
    const color3 = `hsl(${(seed + 180) % 360}, 100%, 92%)`;
    return {
      backgroundImage: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`,
    };
  }
];

export function GenerativeCover({ projectId }: GenerativeCoverProps) {
  const { style, patternIndex } = useMemo(() => {
    const seed = simpleHash(projectId);
    const patternIndex = seed % patterns.length;
    const style = patterns[patternIndex](seed);
    return { style, patternIndex };
  }, [projectId]);

  return (
    <div
      aria-hidden="true"
      className="w-full h-32 bg-muted overflow-hidden"
      style={style}
    >
        {/* You can add more complex SVG patterns here if needed */}
    </div>
  );
}
