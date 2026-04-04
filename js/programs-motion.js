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
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  /**
   * Mobile: shorter gaps + earlier card band + minimal “dead” keyframe time so scroll never
   * feels like it’s fighting the animation (was ~26% of each card window at opacity 0).
   */
  const CARD_GAP = isMobile ? 0.002 : 0.005;
  const CARDS_START = isMobile ? 0.1 : 0.16;
  /** Finish card reveals earlier on mobile — more scroll is pure coast with cards fully on */
  const CARDS_END = isMobile ? 0.52 : 0.72;
  /** Fraction of each card’s scroll window spent idle at start (lower = less “stuck”) */
  const CARD_INERTIA = isMobile ? 0.04 : 0.12;
  const cardSlideX = isMobile ? 40 : CARD_SLIDE_X;

  if (section && hero) {
    /**
     * start end → end end: progress 0 when the section’s top hits the viewport bottom
     * (block scrolls into view). Previously start start waited until the top pinned under
     * the nav — too late for the headline.
     */
    scroll(
      animate(
        hero,
        {
          opacity: [0, 1, 1, 1, 0],
          y: ['0.85rem', '0rem', '0rem', '0rem', '0rem']
        },
        {
          /* Mobile: shorter plateaus + linear easing so scroll doesn’t “hang” on the hero */
          /* Fade headline out only after card band (CARDS_END ~0.52 on mobile) */
          times: isMobile ? [0, 0.02, 0.07, 0.56, 1] : [0, 0.035, 0.1, 0.7, 1],
          easing: isMobile ? linearScroll : easeSoft
        }
      ),
      { target: section, offset: ['start end', 'end end'] }
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
            x: [cardSlideX, cardSlideX, 0],
            scale: [0.96, 0.96, 1]
          },
          {
            /* Tighten first leg: most of each window is the actual fade/slide (linear = even with scroll) */
            times: [0, CARD_INERTIA, 1],
            easing: linearScroll
          }
        ),
        { target: section, offset: [startStr, endStr] }
      );
    });
  }
}
