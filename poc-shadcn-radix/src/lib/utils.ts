import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// clsx handles conditionals; twMerge resolves Tailwind conflicts ("px-2 px-4" -> "px-4").
// Without twMerge, a consumer's className could not reliably override a component default.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
