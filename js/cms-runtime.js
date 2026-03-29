/* global firebase, FIREBASE_CONFIG, EthanCMSDefaults */

(function () {
    const STORAGE_KEYS = {
        draft: 'ethan_cope_cms_draft',
        published: 'ethan_cope_cms_published'
    };

    const DEFAULTS = window.EthanCMSDefaults || {};

    function deepMerge(base, patch) {
        if (Array.isArray(base) || Array.isArray(patch)) return patch;
        if (base && typeof base === 'object' && patch && typeof patch === 'object') {
            const out = { ...base };
            Object.keys(patch).forEach((k) => {
                out[k] = deepMerge(base[k], patch[k]);
            });
            return out;
        }
        return patch === undefined ? base : patch;
    }

    function setTheme(theme) {
        if (!theme) return;
        // We only override key accent variables and a few tailwind classes via shared.css selectors.
        const d = DEFAULTS?.theme || {};
        const pick = (val, fallback) => (typeof val === 'string' && val.trim() ? val.trim() : fallback);
        document.documentElement.style.setProperty('--cms-rust', pick(theme.rust, d.rust));
        document.documentElement.style.setProperty('--cms-amber', pick(theme.amber, d.amber));
        document.documentElement.style.setProperty('--cms-steel', pick(theme.steel, d.steel));
        document.documentElement.style.setProperty('--cms-gunmetal', pick(theme.gunmetal, d.gunmetal));
        document.documentElement.style.setProperty('--cms-void', pick(theme.void, d.void));
    }

    function applyHome(content) {
        const heroSub = document.getElementById('hero-sub');
        if (heroSub && content?.home?.heroSubtitle) heroSub.textContent = content.home.heroSubtitle;

        const heroApplyLabel = document.getElementById('hero-apply-label');
        if (heroApplyLabel && content?.home?.heroApplyLabel)
            heroApplyLabel.textContent = content.home.heroApplyLabel;

        const heroViewProgramsLabel = document.getElementById('hero-view-programs-label');
        if (heroViewProgramsLabel && content?.home?.heroViewProgramsLabel)
            heroViewProgramsLabel.textContent = content.home.heroViewProgramsLabel;

        const bottomApply = document.getElementById('bottom-cta-apply-label');
        if (bottomApply && content?.home?.bottomCtaApplyLabel)
            bottomApply.textContent = content.home.bottomCtaApplyLabel;

        const bottomViewPrograms = document.getElementById('bottom-cta-view-programs-label');
        if (bottomViewPrograms && content?.home?.bottomCtaViewProgramsLabel)
            bottomViewPrograms.textContent = content.home.bottomCtaViewProgramsLabel;
    }

    function applyResults(content) {
        const video = document.getElementById('testimonial-video-bg');
        if (video && content?.results?.videoUrl) {
            if (video.getAttribute('src') !== content.results.videoUrl) {
                video.setAttribute('src', content.results.videoUrl);
                // Reload only if source changed.
                try {
                    video.load();
                } catch (_) {}
            }
        }

        const slides = Array.from(document.querySelectorAll('[data-testimonial-slide]'));
        const testimonials = content?.results?.testimonials || [];

        slides.forEach((slideEl, idx) => {
            const t = testimonials[idx];
            if (!t) return;
            const resultEl = slideEl.querySelector('[data-testimonial-field="result"]');
            const quoteEl = slideEl.querySelector('[data-testimonial-field="quote"]');
            const authorEl = slideEl.querySelector('[data-testimonial-field="author"]');
            if (resultEl && t.result) resultEl.textContent = t.result;
            if (quoteEl && t.quote) quoteEl.textContent = t.quote;
            if (authorEl && t.author) authorEl.textContent = t.author;
        });
    }

    async function injectScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) return resolve();
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load script: ' + src));
            document.head.appendChild(s);
        });
    }

    async function ensureFirebaseClient() {
        // If config is missing, CMS uses localStorage fallback.
        const cfg = window.FIREBASE_CONFIG;
        if (!cfg) return null;
        if (window.firebase && window.firebase.apps && window.firebase.apps.length) return window.firebase;

        await injectScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
        await injectScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js');
        await injectScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js');

        // firebase-auth is optional for public rendering, but harmless.
        await injectScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js');

        if (!window.firebase) return null;

        try {
            window.firebase.initializeApp(cfg);
        } catch (e) {
            // ignore if already initialized
        }
        return window.firebase;
    }

    async function loadPublishedContent() {
        let local = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.published);
            if (raw) local = JSON.parse(raw);
        } catch (_) {}

        let base = local || DEFAULTS;

        const firebaseClient = await ensureFirebaseClient();
        if (!firebaseClient) return base;

        try {
            const doc = await firebaseClient.firestore().collection('cms').doc('published').get();
            if (doc.exists) base = deepMerge(base, doc.data());
        } catch (_) {
            // keep fallback
        }

        return base;
    }

    function getDraftContent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.draft);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (_) {
            return null;
        }
    }

    window.EthanCMS = window.EthanCMS || {};
    window.EthanCMS.loadPublishedContent = loadPublishedContent;
    window.EthanCMS.ensureFirebaseClient = ensureFirebaseClient;
    window.EthanCMS.setDraftContent = function (content) {
        localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(content));
    };
    window.EthanCMS.publishDraftToLocal = function () {
        const draft = getDraftContent();
        if (!draft) return;
        localStorage.setItem(STORAGE_KEYS.published, JSON.stringify(draft));
    };

    window.EthanCMS.publishDraftToFirebase = async function () {
        const cfg = window.FIREBASE_CONFIG;
        if (!cfg) return { ok: false, reason: 'FIREBASE_CONFIG not set' };
        const draft = getDraftContent();
        if (!draft) return { ok: false, reason: 'No draft content in localStorage' };

        const firebaseClient = await ensureFirebaseClient();
        if (!firebaseClient) return { ok: false, reason: 'Firebase client init failed' };

        await firebaseClient.firestore().collection('cms').doc('published').set(draft, { merge: true });
        return { ok: true };
    };

    window.EthanCMS.applyCmsToPage = async function () {
        const page = document.body?.dataset?.page || '';
        if (!page || !['home', 'results'].includes(page)) return;

        const content = await loadPublishedContent();
        setTheme(content?.theme);

        if (page === 'home') applyHome(content);
        if (page === 'results') applyResults(content);
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Fire and forget
        window.EthanCMS.applyCmsToPage?.();
    });
})();

