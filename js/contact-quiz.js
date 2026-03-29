/**
 * Find Your Fit: step-by-step quiz → program recommendations.
 */
const PROGRAMS = [
    {
        id: 'in-person',
        name: 'In-Person Training',
        description: 'Hands-on form work and programming tailored to your injuries. Best if you have multiple limitations or want direct coaching.',
        price: 'From $X/session',
        suggested: false
    },
    {
        id: 'online-bundle',
        name: 'Online Training + Nutrition Bundle',
        description: 'Full coaching with nutrition guidance. Best if you struggle with nutrition or want support across training and diet.',
        price: 'From $X/mo',
        suggested: false
    },
    {
        id: 'premade',
        name: 'Premade Programs',
        description: 'Structured programs you can follow on your own time. Best if you’re super busy and want clarity without weekly calls.',
        price: 'One-time',
        suggested: false
    }
];

function getSuggestedPrograms(answers) {
    const { nutrition, injuries, schedule } = answers;
    const suggestInPerson = injuries === 'multiple' || (injuries === 'one' && schedule === 'flexible');
    const suggestOnline = nutrition === 'yes' || nutrition === 'sometimes';
    const suggestPremade = schedule === 'very-busy';

    return PROGRAMS.map(p => ({
        ...p,
        suggested:
            (p.id === 'in-person' && suggestInPerson) ||
            (p.id === 'online-bundle' && suggestOnline) ||
            (p.id === 'premade' && suggestPremade)
    }));
}

const TOTAL_STEPS = 4;
const STEP_FIELDS = ['nutrition', 'exercise', 'injuries', 'schedule'];

const form = document.getElementById('contact-quiz');
const nextBtn = document.getElementById('quiz-next');
const backBtn = document.getElementById('quiz-back');
const submitBtn = document.getElementById('quiz-submit');
const progressFill = document.getElementById('quiz-progress-fill');
const stepLabel = document.getElementById('quiz-step-label');
const panels = () => document.querySelectorAll('.quiz-step-panel');

let currentStep = 1;

function showStep(n) {
    currentStep = Math.max(1, Math.min(TOTAL_STEPS, n));
    panels().forEach((p) => {
        const step = parseInt(p.getAttribute('data-quiz-step'), 10);
        p.classList.toggle('is-active', step === currentStep);
    });
    const pct = (currentStep / TOTAL_STEPS) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (stepLabel) stepLabel.textContent = `STEP ${currentStep} OF ${TOTAL_STEPS}`;
    if (backBtn) backBtn.classList.toggle('hidden', currentStep === 1);
    if (nextBtn) nextBtn.classList.toggle('hidden', currentStep === TOTAL_STEPS);
    if (submitBtn) submitBtn.classList.toggle('hidden', currentStep !== TOTAL_STEPS);
}

function currentStepAnswered() {
    const name = STEP_FIELDS[currentStep - 1];
    return !!form.querySelector(`[name="${name}"]:checked`);
}

nextBtn?.addEventListener('click', () => {
    if (!currentStepAnswered()) {
        alert('Choose an option to continue.');
        return;
    }
    showStep(currentStep + 1);
});

backBtn?.addEventListener('click', () => showStep(currentStep - 1));

showStep(1);

form?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (currentStep < TOTAL_STEPS) {
        e.preventDefault();
        nextBtn?.click();
    }
});

form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const nutrition = form.querySelector('[name="nutrition"]:checked')?.value;
    const exercise = form.querySelector('[name="exercise"]:checked')?.value;
    const injuries = form.querySelector('[name="injuries"]:checked')?.value;
    const schedule = form.querySelector('[name="schedule"]:checked')?.value;

    if (!nutrition || !exercise || !injuries || !schedule) {
        alert('Please answer all questions.');
        return;
    }

    const options = getSuggestedPrograms({ nutrition, exercise, injuries, schedule });
    const listEl = document.getElementById('quiz-options-list');
    listEl.innerHTML = options.map(p => `
        <div class="program-card border-steel ${p.suggested ? 'border-rust bg-gunmetal' : ''}">
            ${p.suggested ? '<span class="mono-text text-xs text-rust mb-2 block">RECOMMENDED FOR YOU</span>' : ''}
            <h3 class="display-text text-xl text-white mb-2">${p.name}</h3>
            <p class="text-gray-500 text-sm mb-4">${p.description}</p>
            <p class="mono-text text-xs text-rust mb-4">${p.price}</p>
            <a href="checkout.html?program=${encodeURIComponent(p.id)}" class="magnetic-btn inline-block" data-magnetic><span>CHOOSE THIS</span></a>
        </div>
    `).join('');

    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('quiz-wizard')?.classList.add('opacity-60', 'pointer-events-none');
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
