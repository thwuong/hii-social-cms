import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-tiny', 'text-caption'],
    },
  },
});

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * This utility combines clsx for conditional classes
 * and tailwind-merge for proper Tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
