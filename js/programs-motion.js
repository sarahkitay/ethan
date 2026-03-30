/**
 * Programs section: scroll-driven reveal (Motion).
 * Sequence: "01 — PROGRAMS" fades in, then large PROGRAMS title, then cards scale in.
 * Mobile: earlier keyframes + shorter spacer (CSS) so reveals finish without a long empty scroll.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches;

const easeOut = cubicBezier(0.33, 1, 0.68, 1);
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);

function revealAll() {
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
}

if (prefersReducedMotion) {
  revealAll();
} else {
  const section = document.querySelector('.programs-scroll-section');
  const cards = document.querySelectorAll('.program-reveal-card');
  const intro = document.querySelector('.programs-intro');
  const title = document.querySelector('.programs-title');

  const introTimes = isMobile ? [0, 0.08, 1] : [0, 0.15, 1];
  const introEnd = isMobile ? '0.22 end' : '0.3 end';
  const titleTimes = isMobile ? [0, 0.12, 1] : [0, 0.28, 1];
  const titleEnd = isMobile ? '0.28 end' : '0.42 end';
  const titleY = isMobile ? '0.75rem' : '1.5rem';
  const cardOpacityTimes = isMobile ? [0, 0.2, 1] : [0, 0.55, 1];
  const cardScaleTimes = isMobile ? [0, 0.14, 1] : [0, 0.3, 1];
  const cardEndFactor = isMobile ? 0.88 : 1;

  if (section) {
    if (intro) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: introTimes,
          easing: easeSoft
        }),
        { target: section, offset: ['start start', introEnd] }
      );
    }
    if (title) {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: [titleY, titleY, '0rem'] }, {
          times: titleTimes,
          easing: easeOut
        }),
        { target: section, offset: ['start start', titleEnd] }
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
      const endOffset = `${cardEndFactor - index * 0.04} end`;

      scroll(
        animate(card, { opacity: [0, 0, 1] }, {
          times: cardOpacityTimes,
          easing: cubicBezier(0.61, 1, 0.88, 1)
        }),
        { target: section, offset: ['start start', endOffset] }
      );

      scroll(
        animate(card, { scale: [0, 0, 1] }, {
          times: cardScaleTimes,
          easing: scaleEasings[index]
        }),
        { target: section, offset: ['start start', endOffset] }
      );
    });
  }
}
