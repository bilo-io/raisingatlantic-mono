import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple hash function to get a number from a string
const stringToHash = (str: string): number => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

// Function to get a hue value from a string
export function getAvatarHue(name: string): number {
  if (!name) return 220; // A default hue similar to the theme's blue
  const hash = stringToHash(name);
  return Math.abs(hash) % 360;
}
