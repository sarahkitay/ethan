/**
 * Programs section: scroll-driven reveal (Motion).
 * Runs after window load + layout so section height / sticky + spacer are measured correctly.
 *
 * Desktop: shorter spacer (CSS) + tighter scroll offsets so title → cards happens with less scrolling.
 * Cards use one scroll() per element; opacity + scale in the same animate() (no competing drivers).
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const easeOut = cubicBezier(0.33, 1, 0.68, 1);
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);
const cardEase = cubicBezier(0.61, 1, 0.88, 1);

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

function setupProgramsScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealAll();
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const section = document.querySelector('.programs-scroll-section');
  const cards = document.querySelectorAll('.program-reveal-card');
  const intro = document.querySelector('.programs-intro');
  const title = document.querySelector('.programs-title');

  if (!section) return;

  const titleYMob = '0.75rem';
  const titleYDesk = '1.5rem';

  const scaleEasings = [
    cubicBezier(0.42, 0, 0.58, 1),
    cubicBezier(0.76, 0, 0.24, 1),
    cubicBezier(0.87, 0, 0.13, 1)
  ];

  /* Scale starts slightly below 1 to avoid transform bugs with 0 */
  const cardScaleFrom = 0.86;

  if (intro) {
    if (isMobile) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, 0.08, 0.55],
          easing: easeSoft
        }),
        { target: section, offset: ['start end', 'start start'] }
      );
    } else {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, 0.12, 0.55],
          easing: easeSoft
        }),
        { target: section, offset: ['start start', '0.18 end'] }
      );
    }
  }

  if (title) {
    if (isMobile) {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: [titleYMob, titleYMob, '0rem'] }, {
          times: [0, 0.1, 0.55],
          easing: easeOut
        }),
        { target: section, offset: ['start end', 'start start'] }
      );
    } else {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: [titleYDesk, titleYDesk, '0rem'] }, {
          times: [0, 0.2, 0.58],
          easing: easeOut
        }),
        { target: section, offset: ['start start', '0.26 end'] }
      );
    }
  }

  if (cards.length) {
    cards.forEach((card, index) => {
      if (isMobile) {
        const oEnd = Math.min(0.38, 0.2 + index * 0.06);
        const sEnd = Math.min(0.34, 0.16 + index * 0.05);
        const tMid = Math.max(0.03, Math.min(oEnd * 0.22, sEnd * 0.25));
        const tEnd = Math.max(oEnd, sEnd);

        scroll(
          animate(card, { opacity: [0, 0, 1], scale: [cardScaleFrom, cardScaleFrom, 1] }, {
            times: [0, tMid, tEnd],
            easing: scaleEasings[index]
          }),
          { target: section, offset: ['start end', 'start start'] }
        );
      } else {
        const mid = 0.22 + index * 0.05;

        scroll(
          animate(card, { opacity: [0, 0, 1], scale: [cardScaleFrom, cardScaleFrom, 1] }, {
            times: [0, Math.min(0.42, mid), 0.72],
            easing: cardEase
          }),
          { target: section, offset: ['start start', 'end end'] }
        );
      }
    });
  }
}

function scheduleProgramsMotion() {
  const run = () => requestAnimationFrame(() => requestAnimationFrame(setupProgramsScrollAnimations));
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run, { once: true });
  }
}

scheduleProgramsMotion();
