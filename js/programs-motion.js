/**
 * Programs section (Motion).
 * Desktop: scroll-linked hero + card reveals (sticky section + spacer).
 * Mobile (≤900px): no sticky trap - native scroll continues while cards fade/slide in via IntersectionObserver.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);
/** Linear: scroll position maps evenly to progress (no easing fight). */
const linearScroll = cubicBezier(0, 0, 1, 1);
const CARD_SLIDE_X = 56;
const MOBILE_MQ = '(max-width: 900px)';

function mobileProgramsLayout() {
  return window.matchMedia(MOBILE_MQ).matches;
}

/** Cards animate independently of scroll progress so finger scrolling never feels "locked" to the tween. */
function setupMobileProgramReveals(cards) {
  cards.forEach((card, index) => {
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          o.unobserve(entry.target);
          animate(
            entry.target,
            { opacity: 1, x: 0, scale: 1 },
            {
              duration: 0.42,
              delay: Math.min(index * 0.035, 0.25),
              easing: easeSoft
            }
          );
        });
      },
      { root: null, rootMargin: '100px 0px 24px 0px', threshold: 0.06 }
    );
    obs.observe(card);
  });
}

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
} else if (mobileProgramsLayout()) {
  const cards = document.querySelectorAll('.program-reveal-card');
  const hero = document.querySelector('.programs-hero');
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
  }
  setupMobileProgramReveals(cards);
} else {
  const section = document.querySelector('.programs-scroll-section');
  const cards = document.querySelectorAll('.program-reveal-card');
  const hero = document.querySelector('.programs-hero');

  const CARD_GAP = 0.005;
  const CARDS_START = 0.16;
  const CARDS_END = 0.72;
  const CARD_INERTIA = 0.12;

  if (section && hero) {
    scroll(
      animate(
        hero,
        {
          opacity: [0, 1, 1, 1, 0],
          y: ['0.85rem', '0rem', '0rem', '0rem', '0rem']
        },
        {
          times: [0, 0.035, 0.1, 0.7, 1],
          easing: easeSoft
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
            x: [CARD_SLIDE_X, CARD_SLIDE_X, 0],
            scale: [0.96, 0.96, 1]
          },
          {
            times: [0, CARD_INERTIA, 1],
            easing: linearScroll
          }
        ),
        { target: section, offset: [startStr, endStr] }
      );
    });
  }
}
