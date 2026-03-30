/**
 * Client Portal: dashboard (calendar, My Program, Upcoming Appointments/Calls, My Progress),
 * request appointments (approved by admin show on calendar), program requests.
 */
const CLIENT_STORAGE_KEY = 'ethan_cope_client';
const SESSIONS_STORAGE_KEY = 'ethan_cope_sessions';
const APPOINTMENTS_STORAGE_KEY = 'ethan_cope_appointments';
const APPLICATIONS_STORAGE_KEY = 'ethan_cope_applications';
const PROGRAM_INTEREST_KEY = 'ethan_cope_program_interest';
const PROGRAM_REQUESTS_KEY = 'ethan_cope_program_requests';
const CHECKOUT_CLIENTS_KEY = 'ethan_cope_checkout_clients';

const CLIENT_NOTIF_LATEST_REQUESTED_KEY = 'ethan_cope_client_notif_latest_requested_';

function getCheckoutClients() {
    try {
        const raw = localStorage.getItem(CHECKOUT_CLIENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

const DEMO_CLIENT = {
    email: 'client@example.com',
    password: 'client123',
    name: 'Alex'
};

const DEMO_PROGRAM = {
    name: 'Online Coaching',
    type: 'ONLINE',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    notes: 'Weekly check-in Fridays. Training + nutrition personalized.',
    sessionsTotal: 12,
    sessionsUsed: 4
};

const DEMO_SESSIONS = [
    { date: '2024-03-08', workout: 'HYROX Race Sim', duration: 75, notes: 'Felt strong', status: 'completed', clientEmail: 'client@example.com' },
    { date: '2024-03-06', workout: 'Upper Push Strength', duration: 45, notes: '', status: 'completed', clientEmail: 'client@example.com' },
    { date: '2024-03-04', workout: 'Engine Builder', duration: 40, notes: '', status: 'completed', clientEmail: 'client@example.com' },
    { date: '2024-03-01', workout: '5K Tempo Run', duration: 35, notes: 'PB pace', status: 'completed', clientEmail: 'client@example.com' }
];

const DEMO_APPOINTMENTS = [
    { id: '1', date: '2024-03-15', time: 'Morning (8–12)', timeSlot: 'morning', type: 'Check-in call', typeKey: 'check-in', status: 'approved', clientEmail: 'client@example.com', clientName: 'Alex' },
    { id: '2', date: '2024-03-22', time: 'Afternoon (12–5)', timeSlot: 'afternoon', type: 'Video call', typeKey: 'video', status: 'requested', clientEmail: 'client@example.com', clientName: 'Alex' }
];

function getStoredClient() {
    try {
        return JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function setStoredClient(client) {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client));
}

function getStoredSessions() {
    try {
        const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [...DEMO_SESSIONS];
}

function setStoredSessions(sessions) {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

function getStoredAppointments() {
    try {
        const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [...DEMO_APPOINTMENTS];
}

function setStoredAppointments(appointments) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
}

function getClientAppointments(client) {
    if (!client || !client.email) return [];
    return getStoredAppointments().filter(a => (a.clientEmail || '').toLowerCase() === client.email.toLowerCase());
}

function getApprovedAppointments(client) {
    return getClientAppointments(client).filter(a => a.status === 'approved');
}

function getClientSessions(client) {
    if (!client || !client.email) return [];
    return getStoredSessions().filter(s => (s.clientEmail || '').toLowerCase() === client.email.toLowerCase());
}

function getStoredApplications() {
    try {
        const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function setStoredApplications(applications) {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
}

function getStoredProgramInterest() {
    try {
        return localStorage.getItem(PROGRAM_INTEREST_KEY) || null;
    } catch {}
    return null;
}

function setStoredProgramInterest(programKey) {
    if (programKey) localStorage.setItem(PROGRAM_INTEREST_KEY, programKey);
}

function getStoredProgramRequests() {
    try {
        const raw = localStorage.getItem(PROGRAM_REQUESTS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function addProgramRequest(client, programKey) {
    const list = getStoredProgramRequests();
    list.push({ clientEmail: client.email, clientName: client.name || client.email, program: programKey, requestedAt: new Date().toISOString() });
    localStorage.setItem(PROGRAM_REQUESTS_KEY, JSON.stringify(list));
}

function getClientProgram(client) {
    if (!client) return null;
    return client.program || (client.email === DEMO_CLIENT.email ? DEMO_PROGRAM : null);
}

// --- Calendar state (shared for overview + appointments tab) ---
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderClientCalendar(gridId, monthYearId, client) {
    const grid = document.getElementById(gridId);
    const monthYearEl = document.getElementById(monthYearId);
    if (!grid || !monthYearEl) return;

    monthYearEl.textContent = `${MONTHS[calMonth]} ${calYear}`;

    const first = new Date(calYear, calMonth, 1);
    const last = new Date(calYear, calMonth + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const approved = getApprovedAppointments(client);
    const approvedByDate = {};
    approved.forEach(a => {
        if (a.date) approvedByDate[a.date] = (approvedByDate[a.date] || 0) + 1;
    });
    const sessions = getClientSessions(client);
    const sessionsByDate = {};
    sessions.forEach(s => {
        if (s.date) sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + 1;
    });

    let html = '';
    for (let i = 0; i < startPad; i++) html += '<div class="aspect-square p-1"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasAppt = approvedByDate[dateStr];
        const sessionCount = sessionsByDate[dateStr] || 0;
        const isPast = dateStr < new Date().toISOString().slice(0, 10);
        html += `<div class="aspect-square p-1">
            <button type="button" data-date="${dateStr}" class="client-cal-day group relative w-full h-full rounded border border-steel bg-gunmetal/50 hover:border-rust hover:bg-gunmetal text-sm p-1.5 flex flex-col items-start justify-start transition-colors ${isPast ? 'opacity-60' : ''}">
                <span class="leading-none">${d}</span>
                <span class="flex gap-0.5 mt-0.5 flex-shrink-0">
                    ${hasAppt ? '<span class="w-1.5 h-1.5 rounded-full bg-rust" title="Appointment"></span>' : ''}
                    ${sessionCount ? `<span class="text-[10px] text-gray-400 font-medium" title="Session${sessionCount > 1 ? 's' : ''}">${sessionCount}S</span>` : ''}
                </span>
                <span class="client-cal-day-hover absolute inset-0 flex items-center justify-center rounded bg-charcoal/95 border border-rust text-rust mono-text text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">SEND REQUEST</span>
            </button>
        </div>`;
    }
    grid.innerHTML = html;

    grid.querySelectorAll('button[data-date]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('appt-date').value = btn.dataset.date;
            document.getElementById('request-appointment-modal').classList.remove('hidden');
            document.getElementById('request-appointment-modal').classList.add('flex');
        });
    });
}

function renderDashboard(client) {
    const program = getClientProgram(client);
    const approved = getApprovedAppointments(client).filter(a => a.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date));
    const calls = approved.filter(a => (a.typeKey || a.type || '').toLowerCase().includes('call') || (a.type || '').toLowerCase().includes('call'));
    const sessions = getClientSessions(client);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSessions = sessions.filter(s => s.date >= thirtyDaysAgo.toISOString().slice(0, 10));

    if (program) {
        document.getElementById('client-dash-program').textContent = program.name;
        const total = program.sessionsTotal ?? 12;
        const used = program.sessionsUsed ?? sessions.length;
        document.getElementById('client-dash-sessions').textContent = `${Math.max(0, total - used)} of ${total} sessions left`;
        document.getElementById('client-dash-no-program').classList.add('hidden');
    } else {
        document.getElementById('client-dash-program').textContent = '-';
        document.getElementById('client-dash-sessions').textContent = '-';
        document.getElementById('client-dash-no-program').classList.remove('hidden');
    }

    const apptList = document.getElementById('client-dash-appointments');
    const noAppt = document.getElementById('client-dash-no-appointments');
    if (approved.length) {
        noAppt.classList.add('hidden');
        apptList.innerHTML = approved.slice(0, 5).map(a => `<li>${a.date} - ${a.type}</li>`).join('');
    } else {
        apptList.innerHTML = '';
        noAppt.classList.remove('hidden');
    }

    const callsList = document.getElementById('client-dash-calls');
    const noCalls = document.getElementById('client-dash-no-calls');
    if (calls.length) {
        noCalls.classList.add('hidden');
        callsList.innerHTML = calls.slice(0, 5).map(a => `<li>${a.date} ${a.time}</li>`).join('');
    } else {
        callsList.innerHTML = '';
        noCalls.classList.remove('hidden');
    }

    document.getElementById('client-dash-sessions-count').textContent = `${recentSessions.length} sessions logged`;

    const statSessions = document.getElementById('client-stat-sessions');
    const statUpcoming = document.getElementById('client-stat-upcoming');
    if (statSessions) statSessions.textContent = String(recentSessions.length);
    if (statUpcoming) statUpcoming.textContent = String(approved.length);
}

// --- Views ---
function showLogin() {
    document.getElementById('client-login-screen').classList.remove('hidden');
    document.getElementById('client-apply-screen').classList.add('hidden');
    document.getElementById('client-dashboard').classList.add('hidden');

    document.getElementById('client-portal-appt-banner')?.classList.add('hidden');
}

function showApply() {
    document.getElementById('client-login-screen').classList.add('hidden');
    document.getElementById('client-apply-screen').classList.remove('hidden');
    document.getElementById('client-apply-screen').classList.add('flex');
    document.getElementById('client-dashboard').classList.add('hidden');
    document.getElementById('apply-success').classList.add('hidden');

    document.getElementById('client-portal-appt-banner')?.classList.add('hidden');
}

function showDashboard(client) {
    document.getElementById('client-login-screen').classList.add('hidden');
    document.getElementById('client-apply-screen').classList.add('hidden');
    document.getElementById('client-dashboard').classList.remove('hidden');

    const raw = client?.name || 'Client';
    const name = raw.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    document.getElementById('client-name').textContent = name;

    renderOverview(client);
    renderAppointmentsTab(client);
    renderDashboard(client);
    calMonth = new Date().getMonth();
    calYear = new Date().getFullYear();
    renderClientCalendar('client-cal-grid-2', 'client-cal-month-year-2', client);

    maybeShowRequestedApptBanner(client);
    switchClientTab('overview');
}

function maybeShowRequestedApptBanner(client) {
    const bannerEl = document.getElementById('client-portal-appt-banner');
    const bannerTextEl = document.getElementById('client-portal-appt-banner-text');
    if (!bannerEl || !bannerTextEl) return;

    const list = getClientAppointments(client).filter(a => a.status === 'requested');
    if (!list.length) {
        bannerEl.classList.add('hidden');
        bannerTextEl.textContent = '';
        return;
    }

    // Prefer createdAt; fall back to id ordering.
    const latest = list
        .slice()
        .sort((a, b) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            if (tb !== ta) return tb - ta;
            return String(b.id || '').localeCompare(String(a.id || ''));
        })[0];

    const storageKey = CLIENT_NOTIF_LATEST_REQUESTED_KEY + String(client?.email || '').toLowerCase();
    const lastNotifiedId = localStorage.getItem(storageKey) || '';

    if (latest && String(latest.id) && String(latest.id) !== lastNotifiedId) {
        const date = latest.date || '';
        const time = latest.time || latest.timeSlot || '';
        const msg = `You have a new appointment request${date ? ` on ${date}` : ''}${time ? ` (${time})` : ''}. Check APPOINTMENTS for details.`;
        bannerTextEl.textContent = msg;
        bannerEl.classList.remove('hidden');
        localStorage.setItem(storageKey, String(latest.id));
    } else {
        bannerEl.classList.add('hidden');
        bannerTextEl.textContent = '';
    }
}

function renderOverview(client) {
    const sessions = getClientSessions(client);
    const sessionsTbody = document.getElementById('client-sessions-tbody');
    if (sessionsTbody) {
        sessionsTbody.innerHTML = sessions.map(s => `
            <tr>
                <td class="mono-text text-xs">${s.date}</td>
                <td>${s.workout}</td>
                <td class="mono-text text-xs">${s.duration} min</td>
                <td><span class="badge badge-rust">${s.status}</span></td>
            </tr>
        `).join('');
    }
}

function renderAppointmentsTab(client) {
    const appointments = getClientAppointments(client);
    const tbody = document.getElementById('client-appointments-tbody');
    const noAppointments = document.getElementById('client-no-appointments');
    if (!tbody) return;
    const statusLabel = s => s === 'approved' ? 'Confirmed' : s === 'denied' ? 'Denied' : 'Pending';
    if (appointments.length) {
        noAppointments.classList.add('hidden');
        tbody.innerHTML = appointments.sort((a, b) => a.date.localeCompare(b.date)).map(a => `
            <tr>
                <td class="mono-text text-xs">${a.date}</td>
                <td class="mono-text text-xs">${a.time}</td>
                <td>${a.type}</td>
                <td><span class="badge ${a.status === 'approved' ? 'badge-rust' : a.status === 'denied' ? 'bg-red-900/30 text-red-400 border-red-500' : ''}">${statusLabel(a.status)}</span></td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '';
        noAppointments.classList.remove('hidden');
    }
}

function switchClientTab(tabId) {
    document.querySelectorAll('.client-tab').forEach(t => {
        t.classList.remove('active', 'border-rust', 'text-rust');
        t.classList.add('text-gray-500');
    });
    document.querySelector(`[data-client-tab="${tabId}"]`)?.classList.add('active', 'border-rust', 'text-rust');
    document.querySelector(`[data-client-tab="${tabId}"]`)?.classList.remove('text-gray-500');

    document.querySelectorAll('.client-tab-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`client-tab-${tabId}`);
    if (panel) panel.classList.remove('hidden');

    const client = getStoredClient();
    if (tabId === 'appointments' && client) {
        renderClientCalendar('client-cal-grid-2', 'client-cal-month-year-2', client);
    }
}

document.querySelectorAll('.client-tab').forEach(btn => {
    btn.addEventListener('click', () => switchClientTab(btn.getAttribute('data-client-tab')));
});

document.querySelectorAll('[data-client-tab]').forEach(el => {
    if (el.tagName === 'BUTTON') return;
    el.addEventListener('click', () => switchClientTab(el.getAttribute('data-client-tab')));
});

// --- Calendar prev/next ---
function bindCalendarNav(prevId, nextId) {
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (prev) prev.addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } const c = getStoredClient(); renderClientCalendar('client-cal-grid-2', 'client-cal-month-year-2', c); });
    if (next) next.addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } const c = getStoredClient(); renderClientCalendar('client-cal-grid-2', 'client-cal-month-year-2', c); });
}
bindCalendarNav('client-cal-prev-2', 'client-cal-next-2');

// --- Login (demo + checkout clients) ---
document.getElementById('client-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('client-email').value.trim();
    const password = document.getElementById('client-password').value;
    const errEl = document.getElementById('client-login-error');
    if (email === DEMO_CLIENT.email && password === DEMO_CLIENT.password) {
        errEl.classList.add('hidden');
        setStoredClient({ email, name: DEMO_CLIENT.name });
        showDashboard(getStoredClient());
        return;
    }
    const checkoutClients = getCheckoutClients();
    const paid = checkoutClients.find(c => (c.email || '').toLowerCase() === email.toLowerCase() && c.password === password);
    if (paid) {
        errEl.classList.add('hidden');
        setStoredClient({ email: paid.email, name: paid.name || email });
        showDashboard(getStoredClient());
        return;
    }
    errEl.classList.remove('hidden');
});

// --- Auto-login after checkout (welcome=1 + just_paid in sessionStorage) ---
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('welcome') !== '1') return;
    try {
        const raw = sessionStorage.getItem('ethan_cope_just_paid');
        if (!raw) return;
        const { email, name } = JSON.parse(raw);
        sessionStorage.removeItem('ethan_cope_just_paid');
        if (email && name) {
            setStoredClient({ email, name });
            showDashboard(getStoredClient());
            window.history.replaceState({}, '', 'client-portal.html');
        }
    } catch (_) {}
})();

document.getElementById('client-logout').addEventListener('click', () => {
    localStorage.removeItem(CLIENT_STORAGE_KEY);
    showLogin();
});

// --- Apply for access ---
document.getElementById('show-apply-btn').addEventListener('click', showApply);
document.getElementById('show-login-btn').addEventListener('click', () => {
    document.getElementById('client-apply-screen').classList.add('hidden');
    document.getElementById('client-login-screen').classList.remove('hidden');
});

document.getElementById('client-apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('apply-name').value.trim();
    const email = document.getElementById('apply-email').value.trim();
    const password = document.getElementById('apply-password').value;
    const interest = document.getElementById('apply-interest').value;
    const applications = getStoredApplications();
    applications.push({ name, email, interest, appliedAt: new Date().toISOString() });
    setStoredApplications(applications);
    document.getElementById('apply-success').classList.remove('hidden');
    document.getElementById('client-apply-form').reset();
});

// --- Request appointment ---
function openRequestAppointmentModal() {
    document.getElementById('appt-date').value = new Date().toISOString().slice(0, 10);
    document.getElementById('request-appointment-modal').classList.remove('hidden');
    document.getElementById('request-appointment-modal').classList.add('flex');
}

document.getElementById('client-request-appointment-btn-2').addEventListener('click', openRequestAppointmentModal);

document.getElementById('request-appointment-cancel').addEventListener('click', () => {
    document.getElementById('request-appointment-modal').classList.add('hidden');
    document.getElementById('request-appointment-modal').classList.remove('flex');
});

document.getElementById('request-appointment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const client = getStoredClient();
    const timeSel = document.getElementById('appt-time');
    const timeLabels = { morning: 'Morning (8–12)', afternoon: 'Afternoon (12–5)', evening: 'Evening (5–8)', flexible: 'Flexible' };
    const typeSel = document.getElementById('appt-type');
    const typeLabels = { 'check-in': 'Check-in call', 'in-person': 'In-person session', 'video': 'Video call', 'other': 'Other' };
    const appointments = getStoredAppointments();
    appointments.push({
        id: String(Date.now()),
        date: document.getElementById('appt-date').value,
        time: timeLabels[timeSel.value] || timeSel.value,
        timeSlot: timeSel.value,
        type: typeLabels[typeSel.value] || typeSel.value,
        typeKey: typeSel.value,
        status: 'requested',
        notes: document.getElementById('appt-notes').value,
        clientEmail: client ? client.email : '',
        clientName: client ? client.name : ''
    });
    setStoredAppointments(appointments);
    document.getElementById('request-appointment-modal').classList.add('hidden');
    document.getElementById('request-appointment-modal').classList.remove('flex');
    document.getElementById('request-appointment-form').reset();
    renderOverview(client);
    renderAppointmentsTab(client);
    renderDashboard(client);
    renderClientCalendar('client-cal-grid-2', 'client-cal-month-year-2', client);
});

// --- Log session ---
document.getElementById('client-log-session-btn').addEventListener('click', () => {
    document.getElementById('session-date').value = new Date().toISOString().slice(0, 10);
    document.getElementById('log-session-modal').classList.remove('hidden');
    document.getElementById('log-session-modal').classList.add('flex');
});

const logSessionBtnDash = document.getElementById('client-log-session-btn-dash');
if (logSessionBtnDash) logSessionBtnDash.addEventListener('click', () => document.getElementById('client-log-session-btn').click());

document.getElementById('client-quick-log')?.addEventListener('click', () => {
    switchClientTab('overview');
    document.getElementById('client-log-session-btn').click();
});
document.getElementById('client-quick-book')?.addEventListener('click', () => {
    switchClientTab('appointments');
    setTimeout(() => document.getElementById('client-cal-grid-2')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
});

document.getElementById('log-session-cancel').addEventListener('click', () => {
    document.getElementById('log-session-modal').classList.add('hidden');
    document.getElementById('log-session-modal').classList.remove('flex');
});

document.getElementById('log-session-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const client = getStoredClient();
    const sessions = getStoredSessions();
    sessions.unshift({
        date: document.getElementById('session-date').value,
        workout: document.getElementById('session-workout').value || 'Workout',
        duration: parseInt(document.getElementById('session-duration').value, 10) || 0,
        notes: document.getElementById('session-notes').value,
        status: 'completed',
        clientEmail: client ? client.email : ''
    });
    setStoredSessions(sessions);
    document.getElementById('log-session-modal').classList.add('hidden');
    document.getElementById('log-session-modal').classList.remove('flex');
    showDashboard(getStoredClient());
});

// --- Program selection: save interest + add to program requests for admin ---
document.querySelectorAll('.client-select-program').forEach(btn => {
    btn.addEventListener('click', () => {
        const program = btn.getAttribute('data-program');
        const client = getStoredClient();
        setStoredProgramInterest(program);
        if (client) addProgramRequest(client, program);
        document.getElementById('client-program-interest-msg').classList.remove('hidden');
    });
});

// --- Init ---
const client = getStoredClient();
if (client && client.email) {
    showDashboard(client);
} else {
    showLogin();
}

// If admin schedules a new appointment in another tab, refresh notification banner.
window.addEventListener('storage', (e) => {
    if (!client || !client.email) return;
    if (e.key !== APPOINTMENTS_STORAGE_KEY) return;
    maybeShowRequestedApptBanner(client);
});
