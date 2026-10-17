"use client";

/**
 * Current year. The server renders its own year at build time and the browser
 * renders today's; the hydration warning for the (rare) mismatch is suppressed
 * so the client value wins.
 */
export function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
