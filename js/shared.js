// Shared: magnetic buttons (for pages without WebGL/GSAP)
document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
});

// Mobile nav: toggle panel when hamburger is clicked (same nav across site)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNavPanel = document.getElementById('mobile-nav-panel');
if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNavPanel.classList.toggle('hidden');
    });
    mobileNavPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { mobileNavPanel.classList.add('hidden'); });
    });
}

// Testimonials: slide in from left when they enter viewport (one at a time on scroll)
if (typeof IntersectionObserver !== 'undefined') {
    document.querySelectorAll('.testimonial-reveal').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
        observer.observe(el);
    });
}
