// Register GSAP
gsap.registerPlugin(ScrollTrigger);

// Magnetic buttons: see js/shared.js (loaded before this file)

// WebGL Fluid Background
const container = document.getElementById('webgl-container');
if (container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            vec2 mouse = uMouse / uResolution;

            float dist = distance(uv, mouse);
            float strength = smoothstep(0.5, 0.0, dist) * 0.5;

            float wave = sin(uv.x * 10.0 + uTime) * 0.02;
            wave += sin(uv.y * 8.0 + uTime * 0.8) * 0.02;

            vec2 distortion = (uv - mouse) * strength * 0.1;

            vec2 finalUv = uv + distortion + wave;

            vec3 color1 = vec3(0.04, 0.04, 0.04);
            vec3 color2 = vec3(0.08, 0.08, 0.08);
            vec3 color3 = vec3(0.514, 0.694, 0.953);

            float gradient = smoothstep(0.0, 1.0, finalUv.y + sin(finalUv.x * 3.0 + uTime * 0.5) * 0.1);
            vec3 color = mix(color1, color2, gradient);

            float glow = smoothstep(0.4, 0.0, dist) * 0.15;
            color = mix(color, color3, glow);

            float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.2);
            color *= vignette;

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader,
        fragmentShader
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 1;

    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = window.innerHeight - e.clientY;
    });

    let isActive = true;
    const clock = new THREE.Clock();

    function animate() {
        if (!isActive) return;
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uMouse.value.x += (targetMouseX - material.uniforms.uMouse.value.x) * 0.05;
        material.uniforms.uMouse.value.y += (targetMouseY - material.uniforms.uMouse.value.y) * 0.05;
        material.uniforms.uTime.value = elapsedTime;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
        isActive = document.visibilityState === 'visible';
        if (isActive) animate();
    });
}

// Hero Animations
const heroTl = gsap.timeline({ delay: 0.5 });

heroTl.to('#hero-label', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
})
.to('.reveal-text span', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.1,
    ease: 'expo.out'
}, '-=0.5')
.to('#hero-sub', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
}, '-=0.8')
.to('#hero-cta', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
}, '-=0.6');

// Programs scroll reveal: Motion in js/programs-motion.js (desktop + mobile).

// Scroll Triggers (exclude .program-card so all three cards stay visible)
gsap.utils.toArray('.screen-section').forEach(section => {
    const targets = section.querySelectorAll('.section-marker, h2, p, .stat-item');
    if (targets.length) {
        gsap.from(targets, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
});

// Parallax Images
gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
        scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: '30%',
        ease: 'none'
    });
});

// Results section: animated outcome counters (-12% body fat, time, +lbs)
gsap.utils.toArray('.result-stat-counter').forEach(el => {
    const type = el.getAttribute('data-counter-type');
    ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
            if (type === 'percent') {
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const obj = { n: 0 };
                gsap.to(obj, {
                    n: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = prefix + Math.round(obj.n) + suffix;
                    }
                });
            } else if (type === 'time') {
                const targetMin = parseInt(el.getAttribute('data-min'), 10) || 0;
                const targetSec = parseInt(el.getAttribute('data-sec'), 10) || 0;
                const prefix = el.getAttribute('data-prefix') || '';
                const endSecs = targetMin * 60 + targetSec;
                const obj = { t: 0 };
                gsap.to(obj, {
                    t: endSecs,
                    duration: 2.2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        const m = Math.floor(obj.t / 60);
                        const s = Math.round(obj.t % 60);
                        el.textContent = prefix + m + ':' + String(s).padStart(2, '0') + ' TIME';
                    }
                });
            } else if (type === 'number') {
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const obj = { n: 0 };
                gsap.to(obj, {
                    n: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = prefix + Math.round(obj.n) + suffix;
                    }
                });
            }
        }
    });
});

// Stats Counter Animation
gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    const suffix = stat.getAttribute('data-suffix') || '';
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power2.out',
                onComplete: () => {
                    if (suffix) stat.innerHTML = target + suffix;
                }
            });
        }
    });
});

// Line Draw Animation
gsap.utils.toArray('.line-draw').forEach(line => {
    ScrollTrigger.create({
        trigger: line,
        start: 'top 85%',
        onEnter: () => line.classList.add('active')
    });
});

// Text Stroke Effect
const textStroke = document.querySelector('.text-stroke');
if (textStroke) {
    gsap.to('.text-stroke', {
        scrollTrigger: {
            trigger: '.text-stroke',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        },
        color: '#83B1F3',
        '-webkit-text-stroke': '2px #83B1F3'
    });
}

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Bottom CTA bar: show when scrolled past hero
const bottomCta = document.getElementById('bottom-cta');
if (bottomCta) {
    const showAfter = Math.min(window.innerHeight * 0.5, 400);
    function toggleBottomCta() {
        bottomCta.classList.toggle('is-visible', window.scrollY > showAfter);
    }
    window.addEventListener('scroll', toggleBottomCta, { passive: true });
    toggleBottomCta();
}

// --- Nutrition promo popup: show only after scrolling through full page ---
const nutritionPromoPopup = document.getElementById('nutrition-promo-popup');

function checkNutritionPromo() {
    if (!nutritionPromoPopup || sessionStorage.getItem('nutrition_promo_seen')) return;
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight - 80;
    if (scrollBottom >= pageBottom) {
        nutritionPromoPopup.classList.remove('hidden');
    }
}
window.addEventListener('scroll', checkNutritionPromo, { passive: true });
window.addEventListener('load', checkNutritionPromo);

document.getElementById('nutrition-promo-close')?.addEventListener('click', () => {
    nutritionPromoPopup?.classList.add('hidden');
    sessionStorage.setItem('nutrition_promo_seen', '1');
});
document.getElementById('nutrition-promo-btn')?.addEventListener('click', () => {
    sessionStorage.setItem('nutrition_promo_seen', '1');
});

// Contact / intake form: save to localStorage for admin to view
const INTAKE_FORMS_KEY = 'ethan_cope_intake_forms';
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = (document.getElementById('contact-name') && document.getElementById('contact-name').value) || '';
        const email = (document.getElementById('contact-email') && document.getElementById('contact-email').value) || '';
        const goal = (document.getElementById('contact-goal') && document.getElementById('contact-goal').value) || '';
        const message = (document.getElementById('contact-message') && document.getElementById('contact-message').value) || '';
        let forms = [];
        try {
            const raw = localStorage.getItem(INTAKE_FORMS_KEY);
            if (raw) forms = JSON.parse(raw);
        } catch (_) {}
        forms.push({ name, email, goal, message, submittedAt: new Date().toISOString() });
        localStorage.setItem(INTAKE_FORMS_KEY, JSON.stringify(forms));
        contactForm.reset();
        alert('Application submitted. We\'ll be in touch within 24 hours.');
    });
}
