/**
 * Programs section: scroll-driven reveal (Motion).
 * Order: intro → huge "PROGRAMS" (stays visible until section ends) → cards slide in from the right, one-by-one.
 * Each card reaches full opacity + motion by ~40% of its segment before the next card ramps.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);
const opacityEase = cubicBezier(0.61, 1, 0.88, 1);

/** Horizontal slide-in (px); cards enter from the right */
const CARD_SLIDE_X = 56;

if (prefersReducedMotion) {
  document.querySelectorAll('.program-reveal-card').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(0) scale(1)';
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

  const INTRO_END = 0.09;
  const TITLE_END = 0.235;
  const CARD_SEGMENT = 0.048;
  const CARD_GAP = 0.0065;
  const CARDS_START = TITLE_END;

  const slideEasings = [
    cubicBezier(0.42, 0, 0.58, 1),
    cubicBezier(0.76, 0, 0.24, 1),
    cubicBezier(0.87, 0, 0.13, 1)
  ];

  if (section) {
    if (intro) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, 0.18, 1],
          easing: easeSoft
        }),
        { target: section, offset: ['start start', `${INTRO_END} end`] }
      );
    }

    if (title) {
      /**
       * Track full section pass (start→end). Title fades in early, holds for most of the scroll,
       * then fades only as the section leaves (user has moved past Programs).
       */
      scroll(
        animate(
          title,
          {
            opacity: [0, 0, 1, 1, 0],
            y: ['2rem', '2rem', '0rem', '0rem', '0rem'],
            scale: [0.96, 0.96, 1, 1, 1]
          },
          {
            times: [0, 0.06, 0.14, 0.82, 1],
            easing: easeSoft
          }
        ),
        { target: section, offset: ['start start', 'end end'] }
      );
    }
  }

  if (section && cards.length) {
    cards.forEach((card, index) => {
      const start = CARDS_START + index * (CARD_SEGMENT + CARD_GAP);
      const end = start + CARD_SEGMENT;
      const startStr = `${start.toFixed(4)} end`;
      const endStr = `${end.toFixed(4)} end`;
      const slideEase = slideEasings[index % slideEasings.length];

      scroll(
        animate(
          card,
          {
            opacity: [0, 0, 1],
            x: [CARD_SLIDE_X, CARD_SLIDE_X, 0],
            scale: [0.93, 0.93, 1]
          },
          {
            times: [0, 0.4, 1],
            /* Two segments: hold hidden, then reveal (opacity + slide + scale) */
            easing: [opacityEase, slideEase]
          }
        ),
        { target: section, offset: [startStr, endStr] }
      );
    });
  }
}
