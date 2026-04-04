/**
 * Programs section: scroll-driven reveal (Motion).
 * “01 — PROGRAMS” + big PROGRAMS headline share one hero fade (same moment).
 * Pricing cards reveal on scroll; segment math scales to card count so none get stuck.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);
/** Linear — scroll position maps evenly to card reveal (less “sticky” easing fight) */
const linearScroll = cubicBezier(0, 0, 1, 1);

const CARD_SLIDE_X = 56;

if (prefersReducedMotion) {
  document.querySelectorAll('.program-reveal-card').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(0) scale(1)';
  });
  const hero = document.querySelector('.programs-hero');
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
  }
} else {
  const section = document.querySelector('.programs-scroll-section');
  const cards = document.querySelectorAll('.program-reveal-card');
  const hero = document.querySelector('.programs-hero');

  /** Space between card windows (section progress 0–1) */
  const CARD_GAP = 0.005;
  /**
   * Finish reveals by ~0.72 so most remaining section scroll is “coast” with cards fully on
   * (pairs with shorter .programs-scroll-spacer for smoother exit).
   */
  const CARDS_START = 0.1;
  const CARDS_END = 0.72;

  if (section && hero) {
    scroll(
      animate(
        hero,
        {
          opacity: [0, 0, 1, 1, 0],
          y: ['0.75rem', '0.75rem', '0rem', '0rem', '0rem']
        },
        {
          times: [0, 0.03, 0.09, 0.78, 1],
          easing: easeSoft
        }
      ),
      { target: section, offset: ['start start', 'end end'] }
    );
  }

  if (section && cards.length) {
    const n = cards.length;
    const totalGap = Math.max(0, n - 1) * CARD_GAP;
    const band = Math.max(CARDS_END - CARDS_START - totalGap, 0.05);
    const CARD_SEGMENT = band / n;

    cards.forEach((card, index) => {
      const start = CARDS_START + index * (CARD_SEGMENT + CARD_GAP);
      const end = start + CARD_SEGMENT;
      const startStr = `${start.toFixed(4)} end`;
      const endStr = `${end.toFixed(4)} end`;

      scroll(
        animate(
          card,
          {
            opacity: [0, 0, 1],
            x: [CARD_SLIDE_X, CARD_SLIDE_X, 0],
            scale: [0.96, 0.96, 1]
          },
          {
            /* Hit full visibility earlier in each segment = scroll keeps feeling responsive */
            times: [0, 0.26, 1],
            easing: linearScroll
          }
        ),
        { target: section, offset: [startStr, endStr] }
      );
    });
  }
}
