/* global EthanCMS, EthanCMSDefaults */

(function () {
    const adminTabBtn = document.querySelector('[data-tab="site-cms"]');
    if (!adminTabBtn) return;

    const form = document.getElementById('cms-admin-form');
    const statusEl = document.getElementById('cms-admin-status');
    if (!form) return;

    function getFormContent() {
        const theme = {
            rust: (document.getElementById('cms-theme-rust')?.value || '').trim(),
            amber: (document.getElementById('cms-theme-amber')?.value || '').trim(),
            steel: (document.getElementById('cms-theme-steel')?.value || '').trim(),
            gunmetal: (document.getElementById('cms-theme-gunmetal')?.value || '').trim(),
            void: (document.getElementById('cms-theme-void')?.value || '').trim()
        };

        const home = {
            heroSubtitle: (document.getElementById('cms-home-hero-subtitle')?.value || '').trim(),
            heroApplyLabel: (document.getElementById('cms-home-hero-apply-label')?.value || '').trim(),
            heroViewProgramsLabel: (document.getElementById('cms-home-hero-view-programs-label')?.value || '').trim(),
            bottomCtaApplyLabel: (document.getElementById('cms-home-bottom-apply-label')?.value || '').trim(),
            bottomCtaViewProgramsLabel: (document.getElementById('cms-home-bottom-view-programs-label')?.value || '').trim()
        };

        const results = {
            videoUrl: (document.getElementById('cms-results-video-url')?.value || '').trim(),
            testimonials: [0, 1, 2, 3].map((i) => ({
                result: (document.getElementById(`cms-results-t${i}-result`)?.value || '').trim(),
                quote: (document.getElementById(`cms-results-t${i}-quote`)?.value || '').trim(),
                author: (document.getElementById(`cms-results-t${i}-author`)?.value || '').trim()
            }))
        };

        return { theme, home, results };
    }

    function setStatus(msg, kind) {
        if (!statusEl) return;
        statusEl.textContent = msg || '';
        statusEl.classList.remove('text-rust', 'text-green-500', 'text-red-500', 'hidden');
        if (!msg) {
            statusEl.classList.add('hidden');
            return;
        }
        if (kind === 'success') statusEl.classList.add('text-green-500');
        else if (kind === 'error') statusEl.classList.add('text-red-500');
        else statusEl.classList.add('text-rust');
    }

    function hydrateForm(content) {
        const d = EthanCMSDefaults || {};
        const c = content || d;

        document.getElementById('cms-theme-rust').value = c?.theme?.rust || d.theme?.rust || '';
        document.getElementById('cms-theme-amber').value = c?.theme?.amber || d.theme?.amber || '';
        document.getElementById('cms-theme-steel').value = c?.theme?.steel || d.theme?.steel || '';
        document.getElementById('cms-theme-gunmetal').value = c?.theme?.gunmetal || d.theme?.gunmetal || '';
        document.getElementById('cms-theme-void').value = c?.theme?.void || d.theme?.void || '';

        document.getElementById('cms-home-hero-subtitle').value = c?.home?.heroSubtitle || d.home?.heroSubtitle || '';
        document.getElementById('cms-home-hero-apply-label').value = c?.home?.heroApplyLabel || d.home?.heroApplyLabel || '';
        document.getElementById('cms-home-hero-view-programs-label').value =
            c?.home?.heroViewProgramsLabel || d.home?.heroViewProgramsLabel || '';
        document.getElementById('cms-home-bottom-apply-label').value = c?.home?.bottomCtaApplyLabel || d.home?.bottomCtaApplyLabel || '';
        document.getElementById('cms-home-bottom-view-programs-label').value =
            c?.home?.bottomCtaViewProgramsLabel || d.home?.bottomCtaViewProgramsLabel || '';

        document.getElementById('cms-results-video-url').value = c?.results?.videoUrl || d.results?.videoUrl || '';
        [0, 1, 2, 3].forEach((i) => {
            document.getElementById(`cms-results-t${i}-result`).value =
                c?.results?.testimonials?.[i]?.result || d.results?.testimonials?.[i]?.result || '';
            document.getElementById(`cms-results-t${i}-quote`).value =
                c?.results?.testimonials?.[i]?.quote || d.results?.testimonials?.[i]?.quote || '';
            document.getElementById(`cms-results-t${i}-author`).value =
                c?.results?.testimonials?.[i]?.author || d.results?.testimonials?.[i]?.author || '';
        });
    }

    async function init() {
        try {
            setStatus('Loading…', 'info');
            const content = await EthanCMS.loadPublishedContent();
            hydrateForm(content);
            setStatus('', 'info');
        } catch (e) {
            setStatus('Could not load CMS content.', 'error');
        }
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('Saving draft…', 'info');
        try {
            const nextContent = getFormContent();
            EthanCMS.setDraftContent(nextContent);
            EthanCMS.publishDraftToLocal();
            let firebaseNote = '';
            try {
                const res = await EthanCMS.publishDraftToFirebase?.();
                if (res?.ok) firebaseNote = ' Published to Firebase.';
                else firebaseNote = ' Firebase not published: ' + (res?.reason || 'check config/rules.');
            } catch (e) {
                firebaseNote = ' Firebase publish error: ' + (e?.message || 'unknown error');
            }
            setStatus('Saved locally.' + firebaseNote, 'success');

            // Optional: apply instantly to admin preview pages if open
            try {
                if (typeof window.EthanCMS?.applyCmsToPage === 'function') window.EthanCMS.applyCmsToPage();
            } catch (_) {}
        } catch (_) {
            setStatus('Save failed.', 'error');
        }
    });

    init();
})();

