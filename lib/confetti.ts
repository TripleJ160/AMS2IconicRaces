import confetti from 'canvas-confetti';

/**
 * Triggers a confetti animation for race completion celebration
 * Uses racing-themed colors (red, white, checkered flag black)
 */
export function triggerRaceCompletionConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Fire confetti with racing colors (red, white, black)
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#DC0000', '#FFFFFF', '#1A1A1A'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#DC0000', '#FFFFFF', '#1A1A1A'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#DC0000', '#FFFFFF', '#1A1A1A'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#DC0000', '#FFFFFF', '#1A1A1A'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#DC0000', '#FFFFFF', '#1A1A1A'],
  });
}
