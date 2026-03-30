/**
 * Programs section: scroll-driven reveal (Motion).
 * Sequence: "01 — PROGRAMS" fades in, then large PROGRAMS title, then cards scale in.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobilePrograms = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches;
const easeOut = cubicBezier(0.33, 1, 0.68, 1);
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);

/* Mobile: scroll-linked opacity often never completes; sticky + clip hid cards. Show everything. */
if (prefersReducedMotion || isMobilePrograms) {
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

  if (section) {
    if (intro) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, 0.15, 1],
          easing: easeSoft
        }),
        { target: section, offset: ['start start', '0.3 end'] }
      );
    }
    if (title) {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: ['1.5rem', '1.5rem', '0rem'] }, {
          times: [0, 0.28, 1],
          easing: easeOut
        }),
        { target: section, offset: ['start start', '0.42 end'] }
      );
    }
  }

  if (section && cards.length) {
    const scaleEasings = [
      cubicBezier(0.42, 0, 0.58, 1),
      cubicBezier(0.76, 0, 0.24, 1),
      cubicBezier(0.87, 0, 0.13, 1)
    ];

    cards.forEach((card, index) => {
      const endOffset = `${1 - index * 0.05} end`;

      scroll(
        animate(card, { opacity: [0, 0, 1] }, {
          times: [0, 0.55, 1],
          easing: cubicBezier(0.61, 1, 0.88, 1)
        }),
        { target: section, offset: ['start start', endOffset] }
      );

      scroll(
        animate(card, { scale: [0, 0, 1] }, {
          times: [0, 0.3, 1],
          easing: scaleEasings[index]
        }),
        { target: section, offset: ['start start', endOffset] }
      );
    });
  }
}
