/**
 * Checkout: save client on "payment" success, redirect to client portal with auto-login.
 */
const CHECKOUT_CLIENTS_KEY = 'ethan_cope_checkout_clients';
const PROGRAM_NAMES = {
    'in-person': 'In-Person Training ($120/session)',
    'online-bundle': 'Online Coaching ($75/wk)',
    'premade': 'Program template or bundle',
    'template-fb3': 'Full Body 3×/wk ($30)',
    'template-fb2': 'Full Body 2×/wk ($30)',
    'template-ul4': 'Upper/Lower 4×/wk ($30)',
    'template-ppl5': 'Upper/Lower + PPL 5×/wk ($30)',
    'template-bundle': 'Program bundle — all 4 ($100)',
    'coaching-online': 'Online Coaching ($75/wk)',
    'coaching-inperson': 'In-Person Training ($120/session)',
    'compete': 'Legacy: Compete tier',
    'elite': 'Legacy: Elite tier',
    'vip': 'Legacy: VIP tier',
    '1on1': '1-on-1 coaching'
};

const params = new URLSearchParams(window.location.search);
const programId = params.get('program') || 'premade';
const programName = PROGRAM_NAMES[programId] || PROGRAM_NAMES.premade;

document.getElementById('checkout-program-name').textContent = programName;

function getCheckoutClients() {
    try {
        const raw = localStorage.getItem(CHECKOUT_CLIENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function setCheckoutClients(clients) {
    localStorage.setItem(CHECKOUT_CLIENTS_KEY, JSON.stringify(clients));
}

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const password = document.getElementById('checkout-password').value;

    if (!name || !email || !password) return;

    const clients = getCheckoutClients();
    clients.push({
        email,
        name,
        password,
        programId,
        programName,
        paidAt: new Date().toISOString()
    });
    setCheckoutClients(clients);

    sessionStorage.setItem('ethan_cope_just_paid', JSON.stringify({ email, name }));
    window.location.href = 'client-portal.html?welcome=1';
});
