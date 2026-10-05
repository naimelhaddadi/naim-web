/* Shared motion language: one easing family, a few durations. */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
};

export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1,
  cinematic: 1.4,
};
