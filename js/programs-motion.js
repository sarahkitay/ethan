/**
 * Programs section: scroll-driven reveal (Motion).
 * Offsets: progress 0 when the section enters from below ("start end"), 1 when it has
 * moved through the viewport — so opacity/scales fade IN while scrolling down.
 * (Using "start start" as the first offset inverts progress with sticky + tall sections.)
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

  const introTimes = isMobile ? [0, 0.12, 1] : [0, 0.2, 1];
  const titleTimes = isMobile ? [0, 0.18, 1] : [0, 0.35, 1];
  const titleY = isMobile ? '0.75rem' : '1.5rem';

  /* Headline: fade in as section rises from bottom until top aligns (pins) */
  const heroScrollOffset = ['start end', 'start start'];
  /* Cards: same direction (fade in on scroll down) over the full section pass */
  const cardsScrollOffset = ['start end', 'end start'];

  if (section) {
    if (intro) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: introTimes,
          easing: easeSoft
        }),
        { target: section, offset: heroScrollOffset }
      );
    }
    if (title) {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: [titleY, titleY, '0rem'] }, {
          times: titleTimes,
          easing: easeOut
        }),
        { target: section, offset: heroScrollOffset }
      );
    }
  }

  if (section && cards.length) {
    const scaleEasings = [
      cubicBezier(0.42, 0, 0.58, 1),
      cubicBezier(0.76, 0, 0.24, 1),
      cubicBezier(0.87, 0, 0.13, 1)
    ];

    const baseOpacityMid = isMobile ? 0.28 : 0.42;
    const baseScaleMid = isMobile ? 0.2 : 0.32;
    const stagger = isMobile ? 0.07 : 0.09;

    cards.forEach((card, index) => {
      const opacityTimes = [0, Math.min(0.85, baseOpacityMid + index * stagger), 1];
      const scaleTimes = [0, Math.min(0.75, baseScaleMid + index * stagger), 1];

      scroll(
        animate(card, { opacity: [0, 0, 1] }, {
          times: opacityTimes,
          easing: cubicBezier(0.61, 1, 0.88, 1)
        }),
        { target: section, offset: cardsScrollOffset }
      );

      scroll(
        animate(card, { scale: [0, 0, 1] }, {
          times: scaleTimes,
          easing: scaleEasings[index]
        }),
        { target: section, offset: cardsScrollOffset }
      );
    });
  }
}
