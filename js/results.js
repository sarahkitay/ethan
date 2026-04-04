const slides = Array.from(document.querySelectorAll('[data-testimonial-slide]'));
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');
const toggleBtn = document.getElementById('testimonial-toggle');

if (slides.length) {
    let current = 0;
    let isPaused = false;
    let timer = null;

    function render() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('is-active', idx === current);
        });
    }

    function next() {
        current = (current + 1) % slides.length;
        render();
    }

    function prev() {
        current = (current - 1 + slides.length) % slides.length;
        render();
    }

    function startAuto() {
        clearInterval(timer);
        if (isPaused) return;
        timer = setInterval(next, 3000);
    }

    function setPauseState(paused) {
        isPaused = paused;
        if (toggleBtn) {
            toggleBtn.textContent = isPaused ? 'Play' : 'Pause';
            toggleBtn.setAttribute('aria-label', isPaused ? 'Resume autoplay' : 'Pause autoplay');
        }
        startAuto();
    }

    prevBtn?.addEventListener('click', () => {
        prev();
    });

    nextBtn?.addEventListener('click', () => {
        next();
    });

    toggleBtn?.addEventListener('click', () => {
        setPauseState(!isPaused);
    });

    render();
    startAuto();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timer);
        } else {
            startAuto();
        }
    });
}

/* Long-form story panels: fade/slide in once as they enter view */
const storyPanels = document.querySelectorAll('.client-stories-section .story-panel');
if (storyPanels.length && typeof IntersectionObserver !== 'undefined') {
    const storyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    storyObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
    );
    storyPanels.forEach((panel) => storyObserver.observe(panel));
}
