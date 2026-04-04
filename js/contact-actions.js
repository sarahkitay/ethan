/**
 * Contact page: stacked fields — first tap reveals phone/email, second tap opens tel/sms/mailto.
 */
(function () {
    const ACTIONS = {
        call: {
            hidden: 'Tap to show number',
            revealed: '(818) 703-2026',
            hint: 'Tap again to call',
            go: () => {
                window.location.href = 'tel:8187032026';
            }
        },
        sms: {
            hidden: 'Tap to show number',
            revealed: '(818) 703-2026',
            hint: 'Tap again to open Messages',
            go: () => {
                window.location.href = 'sms:8187032026';
            }
        },
        email: {
            hidden: 'Tap to show email',
            revealed: 'ethanwcope@gmail.com',
            hint: 'Tap again to send email',
            go: () => {
                window.location.href = 'mailto:ethanwcope@gmail.com';
            }
        }
    };

    document.querySelectorAll('[data-reveal-action]').forEach((btn) => {
        const cfg = ACTIONS[btn.dataset.revealAction];
        if (!cfg) return;
        const wrap = btn.closest('.contact-reveal-wrap');
        const hintEl = wrap ? wrap.querySelector('.contact-reveal-hint') : null;
        let phase = 0;

        btn.addEventListener('click', () => {
            if (phase === 0) {
                phase = 1;
                btn.textContent = cfg.revealed;
                btn.classList.add('contact-reveal-field--revealed');
                if (hintEl) {
                    hintEl.textContent = cfg.hint;
                    hintEl.classList.remove('hidden');
                    hintEl.setAttribute('aria-hidden', 'false');
                }
                return;
            }
            cfg.go();
        });
    });
})();
