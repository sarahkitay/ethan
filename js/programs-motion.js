/**
 * Programs section: scroll-driven reveal (Motion).
 * Sequence: "01 — PROGRAMS" fades in, then large PROGRAMS title, then cards scale in.
 */
import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = cubicBezier(0.33, 1, 0.68, 1);
const easeSoft = cubicBezier(0.4, 0, 0.2, 1);

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
  /** Matches `max-width: 900px` in shared.css for programs mobile layout */
  const isMobilePrograms = window.matchMedia('(max-width: 900px)').matches;

  if (section) {
    if (intro) {
      scroll(
        animate(intro, { opacity: [0, 0, 1] }, {
          times: [0, isMobilePrograms ? 0.05 : 0.08, 1],
          easing: easeSoft
        }),
        {
          target: section,
          offset: ['start start', isMobilePrograms ? '0.14 end' : '0.2 end']
        }
      );
    }
    if (title) {
      scroll(
        animate(title, { opacity: [0, 0, 1], y: ['1.5rem', '1.5rem', '0rem'] }, {
          times: [0, isMobilePrograms ? 0.12 : 0.18, 1],
          easing: easeOut
        }),
        {
          target: section,
          offset: ['start start', isMobilePrograms ? '0.2 end' : '0.3 end']
        }
      );
    }
  }

  if (section && cards.length) {
    if (isMobilePrograms) {
      /**
       * Stacked cards + sticky section: scroll-linked progress often never reaches 1
       * before rows leave the viewport. Reveal each card when it enters view instead.
       */
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (entry.intersectionRatio < 0.14) return;
            const el = entry.target;
            cardObserver.unobserve(el);
            animate(
              el,
              { opacity: 1, scale: 1 },
              { duration: 0.42, ease: easeOut }
            );
          });
        },
        {
          root: null,
          threshold: [0, 0.06, 0.14, 0.22, 0.4],
          rootMargin: '6% 0px -8% 0px'
        }
      );
      cards.forEach((card) => cardObserver.observe(card));
    } else {
      const scaleEasings = [
        cubicBezier(0.42, 0, 0.58, 1),
        cubicBezier(0.76, 0, 0.24, 1),
        cubicBezier(0.87, 0, 0.13, 1)
      ];

      cards.forEach((card, index) => {
        const endOffset = `${Math.max(0.38, 0.76 - index * 0.045)} end`;
        const scaleEase = scaleEasings[index % scaleEasings.length];

        scroll(
          animate(card, { opacity: [0, 0, 1] }, {
            times: [0, 0.34, 1],
            easing: cubicBezier(0.61, 1, 0.88, 1)
          }),
          { target: section, offset: ['start start', endOffset] }
        );

        scroll(
          animate(card, { scale: [0, 0, 1] }, {
            times: [0, 0.18, 1],
            easing: scaleEase
          }),
          { target: section, offset: ['start start', endOffset] }
        );
      });
    }
  }
}
