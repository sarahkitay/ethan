/**
 * Programs section: scroll-driven reveal (Motion).
 * Order: intro → huge "PROGRAMS" (hold) → title fades/scales away as cards replace it → cards one-by-one.
 * Each card reaches full opacity + scale within its own scroll window before the next card starts.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = cubicBezier(0.33, 1, 0.68, 1);
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);
const opacityEase = cubicBezier(0.61, 1, 0.88, 1);

if (prefersReducedMotion) {
  document.querySelectorAll('.program-reveal-card').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });
  const intro = document.querySelector('.programs-intro');
  const title = document.querySelector('.programs-title');
  if (intro) intro.style.opacity = '1';
  if (title) {
    title.style.opacity = '1';
    title.style.transform = 'none';
  }
} else {
  const section = document.querySelector('.programs-scroll-section');
  const cards = document.querySelectorAll('.program-reveal-card');
  const intro = document.querySelector('.programs-intro');
  const title = document.querySelector('.programs-title');

  /** Scroll intersections along the programs section (same on mobile + desktop). */
  const INTRO_END = 0.09;
  const TITLE_START = 0.065;
  const TITLE_END = 0.235;
  const CARD_SEGMENT = 0.048;
  const CARD_GAP = 0.0065;
  /** First pricing card begins as the title starts handing off (overlap = “replace” moment). */
  const CARDS_START = TITLE_END;
  /** Title scroll track ends partway into card reveals so it can fade out over the first cards. */
  const TITLE_OUT_END = Math.min(
    CARDS_START + CARD_SEGMENT * 3.5 + CARD_GAP * 2.5,
    0.46
  );

  const scaleEasings = [
    cubicBezier(0.42, 0, 0.58, 1),
    cubicBezier(0.76, 0, 0.24, 1),
    cubicBezier(0.87, 0, 0.13, 1)
  ];

  if (section) {
    if (intro) {
      scroll(
        /**
         * Intro line fades in for the first ~9% of section scroll.
         */
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, 0.18, 1],
          easing: easeSoft
        }),
        { target: section, offset: ['start start', `${INTRO_END} end`] }
      );
    }

    if (title) {
      scroll(
        /**
         * "PROGRAMS": fade in + settle, hold at full size, then fade/shrink while cards take over.
         */
        animate(
          title,
          {
            opacity: [0, 0, 1, 1, 0],
            y: ['2rem', '2rem', '0rem', '0rem', '-1.25rem'],
            scale: [0.96, 0.96, 1, 1, 0.82]
          },
          {
            times: [0, 0.1, 0.34, 0.5, 1],
            easing: easeSoft
          }
        ),
        { target: section, offset: [`${TITLE_START} end`, `${TITLE_OUT_END} end`] }
      );
    }
  }

  if (section && cards.length) {
    cards.forEach((card, index) => {
      const start = CARDS_START + index * (CARD_SEGMENT + CARD_GAP);
      const end = start + CARD_SEGMENT;
      const startStr = `${start.toFixed(4)} end`;
      const endStr = `${end.toFixed(4)} end`;
      const scaleEase = scaleEasings[index % scaleEasings.length];

      /**
       * Reach full opacity + scale by ~42% of this card's segment, then hold
       * until the segment ends — next card only ramps after that.
       */
      scroll(
        animate(card, { opacity: [0, 0, 1] }, {
          times: [0, 0.42, 1],
          easing: opacityEase
        }),
        { target: section, offset: [startStr, endStr] }
      );

      scroll(
        animate(card, { scale: [0, 0, 1] }, {
          times: [0, 0.38, 1],
          easing: scaleEase
        }),
        { target: section, offset: [startStr, endStr] }
      );
    });
  }
}
