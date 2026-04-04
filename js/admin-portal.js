const ADMIN_STORAGE_KEY = 'ethan_cope_admin';
const ADMIN_CLIENTS_KEY = 'ethan_cope_admin_clients';
const ADMIN_PROGRAMS_KEY = 'ethan_cope_admin_programs';
const VISIBLE_WORKOUTS_KEY = 'ethan_cope_visible_workouts';
const CUSTOM_WORKOUTS_KEY = 'ethan_cope_custom_workouts';
const APPOINTMENTS_STORAGE_KEY = 'ethan_cope_appointments';
const INTAKE_FORMS_KEY = 'ethan_cope_intake_forms';
const MEAL_PLAN_FORMS_KEY = 'ethan_cope_meal_plan_forms';
const PROGRAM_REQUESTS_KEY = 'ethan_cope_program_requests';
const APPLICATIONS_STORAGE_KEY = 'ethan_cope_applications';
const CHECKOUT_CLIENTS_KEY = 'ethan_cope_checkout_clients';
const PREBUILT_OVERRIDES_KEY = 'ethan_cope_prebuilt_overrides';
/** Fallback when older stored admin programs omit prebuiltId */
const ADMIN_TEMPLATE_PREBUILT_MAP = { p1: 'pb-fb3', p2: 'pb-fb2', p3: 'pb-ul4', p4: 'pb-ppl5' };

const DEMO_ADMIN = { email: 'admin@ethancope.com', password: 'admin123' };

const DEMO_ADMIN_CLIENTS = [
    { id: 'c1', name: 'Alex', email: 'client@example.com', programId: 'p6', programName: 'Online coaching', startDate: '2024-01-15' },
    { id: 'c2', name: 'Jordan', email: 'jordan@example.com', programId: 'p1', programName: 'Full Body 3× template', startDate: '2024-02-01' },
    { id: 'c3', name: 'Sam', email: 'sam@example.com', programId: 'p5', programName: 'All 4 bundle', startDate: '2024-01-20' }
];

const DEMO_ADMIN_PROGRAMS = [
    { id: 'p1', name: 'Full Body 3× / wk template', type: 'TEMPLATE', prebuiltId: 'pb-fb3', clientCount: 0, duration: 'Ongoing' },
    { id: 'p2', name: 'Full Body 2× / wk template', type: 'TEMPLATE', prebuiltId: 'pb-fb2', clientCount: 0, duration: 'Ongoing' },
    { id: 'p3', name: 'Upper/Lower 4× template', type: 'TEMPLATE', prebuiltId: 'pb-ul4', clientCount: 0, duration: 'Ongoing' },
    { id: 'p4', name: 'Upper/Lower + PPL 5× template', type: 'TEMPLATE', prebuiltId: 'pb-ppl5', clientCount: 0, duration: 'Ongoing' },
    { id: 'p5', name: 'All 4 programs bundle', type: 'BUNDLE', clientCount: 0, duration: 'One-time' },
    { id: 'p6', name: 'Online coaching', type: 'COACHING', clientCount: 2, duration: 'Weekly' },
    { id: 'p7', name: 'In-person training', type: 'COACHING', clientCount: 0, duration: 'Per session' }
];

const ALL_WORKOUTS = [
    { id: 'running-form', title: 'RUNNING FORM', subtitle: 'Pacing & technique' },
    { id: 'rowing-technique', title: 'ROWING TECHNIQUE', subtitle: 'Concept2 & stroke' },
    { id: 'ski-erg', title: 'SKI ERG', subtitle: 'Drive & recovery' },
    { id: 'sled-push-pull', title: 'SLED PUSH & PULL', subtitle: 'HYROX implement' },
    { id: 'sandbag-lunges', title: 'SANDBAG LUNGES', subtitle: 'Load & carry' },
    { id: 'squat-pattern', title: 'SQUAT PATTERN', subtitle: 'Back squat & variations' },
    { id: 'hinge-deadlift', title: 'HINGE & DEADLIFT', subtitle: 'RDL & conventional' },
    { id: 'pressing', title: 'PRESSING', subtitle: 'Bench & overhead' },
    { id: 'conditioning', title: 'CONDITIONING', subtitle: 'Pacing & work capacity' }
];

function getStoredAdmin() {
    try {
        return JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function setStoredAdmin(admin) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
}

function getAdminClients() {
    try {
        const raw = localStorage.getItem(ADMIN_CLIENTS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [...DEMO_ADMIN_CLIENTS];
}

function getAdminPrograms() {
    try {
        const raw = localStorage.getItem(ADMIN_PROGRAMS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [...DEMO_ADMIN_PROGRAMS];
}

function setAdminPrograms(programs) {
    localStorage.setItem(ADMIN_PROGRAMS_KEY, JSON.stringify(programs));
}

function resolveAdminProgramPrebuiltId(program) {
    if (program.prebuiltId) return program.prebuiltId;
    if (program.type !== 'TEMPLATE') return null;
    return ADMIN_TEMPLATE_PREBUILT_MAP[program.id] || null;
}

function getAdminPrebuiltOverridesMap() {
    try {
        const raw = localStorage.getItem(PREBUILT_OVERRIDES_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function mergeAdminPrebuiltEntry(base, over) {
    if (!over) return base;
    const out = { ...base, ...over };
    if (Array.isArray(over.days)) out.days = JSON.parse(JSON.stringify(over.days));
    if (Array.isArray(over.importantNotes)) out.importantNotes = [...over.importantNotes];
    if (Array.isArray(over.features)) out.features = [...over.features];
    if (Array.isArray(over.sampleExercises)) out.sampleExercises = [...over.sampleExercises];
    if (Array.isArray(over.bundleIncludes)) out.bundleIncludes = [...over.bundleIncludes];
    return out;
}

function getAdminMergedPrebuiltTemplate(prebuiltId) {
    const list = typeof window !== 'undefined' ? window.__PREBUILT_PROGRAMS_DATA__ : null;
    if (!list || !Array.isArray(list)) return null;
    const base = list.find((p) => p.id === prebuiltId);
    if (!base) return null;
    const overrides = getAdminPrebuiltOverridesMap();
    return mergeAdminPrebuiltEntry(JSON.parse(JSON.stringify(base)), overrides[prebuiltId]);
}

let adminPrebuiltEditorCurrentId = null;

function adminPrebuiltEditorClose() {
    const modal = document.getElementById('admin-prebuilt-editor-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    adminPrebuiltEditorCurrentId = null;
}

function adminPrebuiltEditorShowError(msg) {
    const err = document.getElementById('admin-prebuilt-editor-error');
    const st = document.getElementById('admin-prebuilt-editor-status');
    if (st) {
        st.classList.add('hidden');
        st.textContent = '';
    }
    if (err) {
        err.textContent = msg;
        err.classList.remove('hidden');
    }
}

function adminPrebuiltEditorClearMessages() {
    ['admin-prebuilt-editor-error', 'admin-prebuilt-editor-status'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.textContent = '';
        }
    });
}

function openAdminPrebuiltEditor(prebuiltId) {
    adminPrebuiltEditorCurrentId = prebuiltId;
    const merged = getAdminMergedPrebuiltTemplate(prebuiltId);
    if (!merged) {
        alert('Program data not loaded. Ensure prebuilt-programs-data.js is included before admin-portal.js.');
        adminPrebuiltEditorCurrentId = null;
        return;
    }
    const modal = document.getElementById('admin-prebuilt-editor-modal');
    const ta = document.getElementById('admin-prebuilt-editor-json');
    const title = document.getElementById('admin-prebuilt-editor-title');
    const hint = document.getElementById('admin-prebuilt-editor-id-hint');
    if (!modal || !ta) return;
    if (title) title.textContent = `Edit: ${merged.name || prebuiltId}`;
    if (hint) hint.textContent = `"${prebuiltId}"`;
    ta.value = JSON.stringify(merged, null, 2);
    adminPrebuiltEditorClearMessages();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function saveAdminPrebuiltEditor() {
    const prebuiltId = adminPrebuiltEditorCurrentId;
    const ta = document.getElementById('admin-prebuilt-editor-json');
    if (!prebuiltId || !ta) return;
    let parsed;
    try {
        parsed = JSON.parse(ta.value);
    } catch (e) {
        adminPrebuiltEditorShowError('Invalid JSON: ' + e.message);
        return;
    }
    if (!parsed || typeof parsed !== 'object') {
        adminPrebuiltEditorShowError('Root must be an object.');
        return;
    }
    if (parsed.id !== prebuiltId) {
        adminPrebuiltEditorShowError(`id must stay "${prebuiltId}".`);
        return;
    }
    if (parsed.kind !== 'template') {
        adminPrebuiltEditorShowError('kind must be "template".');
        return;
    }
    if (!Array.isArray(parsed.days)) {
        adminPrebuiltEditorShowError('days must be an array.');
        return;
    }
    const list = window.__PREBUILT_PROGRAMS_DATA__;
    const base = list?.find((p) => p.id === prebuiltId);
    if (!base) {
        adminPrebuiltEditorShowError('Unknown template.');
        return;
    }
    const merged = mergeAdminPrebuiltEntry(JSON.parse(JSON.stringify(base)), parsed);
    const all = getAdminPrebuiltOverridesMap();
    all[prebuiltId] = merged;
    localStorage.setItem(PREBUILT_OVERRIDES_KEY, JSON.stringify(all));
    adminPrebuiltEditorClearMessages();
    ta.value = JSON.stringify(merged, null, 2);
    const st = document.getElementById('admin-prebuilt-editor-status');
    if (st) {
        st.textContent = 'Saved. Reload programs.html to see changes on the public site.';
        st.classList.remove('hidden');
    }
}

function resetAdminPrebuiltEditor() {
    const prebuiltId = adminPrebuiltEditorCurrentId;
    if (!prebuiltId) return;
    if (!confirm('Remove custom edits for this template and restore the default from the site bundle?')) return;
    const all = getAdminPrebuiltOverridesMap();
    delete all[prebuiltId];
    localStorage.setItem(PREBUILT_OVERRIDES_KEY, JSON.stringify(all));
    const merged = getAdminMergedPrebuiltTemplate(prebuiltId);
    const ta = document.getElementById('admin-prebuilt-editor-json');
    if (merged && ta) ta.value = JSON.stringify(merged, null, 2);
    adminPrebuiltEditorClearMessages();
}

function initAdminPrebuiltTemplateEditor() {
    const list = document.getElementById('admin-programs-list');
    if (list && !list.dataset.prebuiltEditorBound) {
        list.dataset.prebuiltEditorBound = '1';
        list.addEventListener('click', (e) => {
            const card = e.target.closest('[data-prebuilt-template-id]');
            if (!card) return;
            openAdminPrebuiltEditor(card.dataset.prebuiltTemplateId);
        });
        list.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const card = e.target.closest('[data-prebuilt-template-id]');
            if (!card || !list.contains(card)) return;
            e.preventDefault();
            openAdminPrebuiltEditor(card.dataset.prebuiltTemplateId);
        });
    }
    document.getElementById('admin-prebuilt-editor-cancel')?.addEventListener('click', adminPrebuiltEditorClose);
    document.getElementById('admin-prebuilt-editor-save')?.addEventListener('click', saveAdminPrebuiltEditor);
    document.getElementById('admin-prebuilt-editor-reset')?.addEventListener('click', resetAdminPrebuiltEditor);
    document.getElementById('admin-prebuilt-editor-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'admin-prebuilt-editor-modal') adminPrebuiltEditorClose();
    });
}

function getCheckoutClients() {
    try {
        const raw = localStorage.getItem(CHECKOUT_CLIENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setCheckoutClients(clients) {
    localStorage.setItem(CHECKOUT_CLIENTS_KEY, JSON.stringify(clients));
}

function setAdminClients(clients) {
    localStorage.setItem(ADMIN_CLIENTS_KEY, JSON.stringify(clients));
}

function getVisibleWorkouts() {
    try {
        const raw = localStorage.getItem(VISIBLE_WORKOUTS_KEY);
        if (raw) {
            const ids = JSON.parse(raw);
            if (Array.isArray(ids) && ids.length === 3) return ids;
        }
    } catch {}
    const all = getAllWorkouts();
    return all.slice(0, 3).map(w => w.id);
}

function getCustomWorkouts() {
    try {
        const raw = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function setCustomWorkouts(workouts) {
    localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
}

function getAllWorkouts() {
    return ALL_WORKOUTS.concat(getCustomWorkouts());
}

function setVisibleWorkouts(ids) {
    if (Array.isArray(ids) && ids.length >= 1 && ids.length <= 3) {
        localStorage.setItem(VISIBLE_WORKOUTS_KEY, JSON.stringify(ids));
    }
}

function getAppointments() {
    try {
        const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function setAppointments(appointments) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
}

function getIntakeForms() {
    try {
        const raw = localStorage.getItem(INTAKE_FORMS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function getMealPlanForms() {
    try {
        const raw = localStorage.getItem(MEAL_PLAN_FORMS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function getProgramRequests() {
    try {
        const raw = localStorage.getItem(PROGRAM_REQUESTS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function getApplications() {
    try {
        const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function getAdminSessions() {
    try {
        const raw = localStorage.getItem('ethan_cope_sessions');
        if (raw) return JSON.parse(raw);
    } catch {}
    return [
        { date: '2024-03-08', workout: 'HYROX Race Sim', duration: 75, clientEmail: 'client@example.com' },
        { date: '2024-03-06', workout: 'Upper Push Strength', duration: 45, clientEmail: 'client@example.com' },
        { date: '2024-03-04', workout: 'Engine Builder', duration: 40, clientEmail: 'client@example.com' },
        { date: '2024-03-01', workout: '5K Tempo Run', duration: 35, clientEmail: 'client@example.com' }
    ];
}

// --- Admin calendar ---
let adminCalMonth = new Date().getMonth();
let adminCalYear = new Date().getFullYear();
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderAdminCalendar() {
    const grid = document.getElementById('admin-cal-grid');
    const monthYearEl = document.getElementById('admin-cal-month-year');
    if (!grid || !monthYearEl) return;

    monthYearEl.textContent = `${MONTHS[adminCalMonth]} ${adminCalYear}`;

    const appointmentsApproved = getAppointments().filter(a => a.status === 'approved');
    const apptsByDate = {};
    appointmentsApproved.forEach(a => {
        if (a.date) apptsByDate[a.date] = (apptsByDate[a.date] || 0) + 1;
    });
    const sessions = getAdminSessions();
    const sessionsByDate = {};
    sessions.forEach(s => {
        if (s.date) sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + 1;
    });

    const first = new Date(adminCalYear, adminCalMonth, 1);
    const last = new Date(adminCalYear, adminCalMonth + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();

    let html = '';
    for (let i = 0; i < startPad; i++) html += '<div class="aspect-square p-1"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${adminCalYear}-${String(adminCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const apptCount = apptsByDate[dateStr] || 0;
        const sessionCount = sessionsByDate[dateStr] || 0;
        const parts = [];
        if (apptCount) parts.push(`${apptCount} appt${apptCount > 1 ? 's' : ''}`);
        if (sessionCount) parts.push(`${sessionCount} session${sessionCount > 1 ? 's' : ''}`);
        const label = parts.join(', ');
        const allAppts = getAppointments().filter(a => a.date === dateStr);
        const st = { approved: 0, requested: 0, denied: 0 };
        allAppts.forEach(a => {
            const k = (a.status || 'requested').toLowerCase();
            if (k === 'approved') st.approved++;
            else if (k === 'denied') st.denied++;
            else st.requested++;
        });
        const dots = [];
        if (st.approved) dots.push(`<span class="cal-status-dot cal-dot-approved" title="Approved"></span><span class="text-xs text-gray-500">${st.approved}</span>`);
        if (st.requested) dots.push(`<span class="cal-status-dot cal-dot-pending" title="Pending"></span><span class="text-xs text-gray-500">${st.requested}</span>`);
        if (st.denied) dots.push(`<span class="cal-status-dot cal-dot-denied" title="Denied"></span><span class="text-xs text-gray-500">${st.denied}</span>`);
        const dotsHtml = dots.length ? `<div class="flex flex-wrap items-center gap-1 mt-1">${dots.join(' ')}</div>` : '';
        html += `<div class="aspect-square p-1">
            <button type="button" class="cal-day-cell w-full h-full rounded border border-steel bg-gunmetal/50 text-sm p-1.5 flex flex-col items-start justify-start text-left" data-cal-date="${dateStr}" aria-label="Day ${d}">
                <span class="leading-none text-white">${d}</span>
                ${label ? `<span class="text-rust text-[10px] mt-0.5 leading-tight">${label}</span>` : ''}
                ${dotsHtml}
            </button>
        </div>`;
    }
    grid.innerHTML = html;
}

function renderAdminAppointments() {
    const appointments = getAppointments().sort((a, b) => a.date.localeCompare(b.date));
    const tbody = document.getElementById('admin-appointments-tbody');
    const noEl = document.getElementById('admin-no-appointments');
    if (!tbody) return;

    if (appointments.length) {
        noEl.classList.add('hidden');
        tbody.innerHTML = appointments.map(a => {
            const isRequested = a.status === 'requested';
            const actions = isRequested
                ? `<button type="button" class="admin-appt-approve px-2 py-1 text-xs bg-rust text-void hover:bg-amber transition-colors" data-id="${a.id}">APPROVE</button>
                   <button type="button" class="admin-appt-deny px-2 py-1 text-xs border border-red-500 text-red-400 hover:bg-red-500/20 transition-colors ml-1" data-id="${a.id}">DENY</button>`
                : '-';
            const st = (a.status || 'requested').toLowerCase();
            const statusClass =
                st === 'approved' ? 'admin-status admin-status-approved' :
                st === 'denied' ? 'admin-status admin-status-denied' :
                'admin-status admin-status-pending';
            return `<tr>
                <td class="mono-text text-xs">${a.date}</td>
                <td class="mono-text text-xs">${a.time || '-'}</td>
                <td>${(a.clientName || a.clientEmail || '-')}</td>
                <td>${a.type || '-'}</td>
                <td><span class="${statusClass}">${(a.status || 'requested').toUpperCase()}</span></td>
                <td>${actions}</td>
            </tr>`;
        }).join('');
    } else {
        tbody.innerHTML = '';
        noEl.classList.remove('hidden');
    }

    tbody.querySelectorAll('.admin-appt-approve').forEach(btn => {
        btn.addEventListener('click', () => {
            const list = getAppointments();
            const idx = list.findIndex(x => x.id === btn.dataset.id);
            if (idx !== -1) { list[idx].status = 'approved'; setAppointments(list); renderAdminAppointments(); renderAdminCalendar(); }
        });
    });
    tbody.querySelectorAll('.admin-appt-deny').forEach(btn => {
        btn.addEventListener('click', () => {
            const list = getAppointments();
            const idx = list.findIndex(x => x.id === btn.dataset.id);
            if (idx !== -1) { list[idx].status = 'denied'; setAppointments(list); renderAdminAppointments(); renderAdminCalendar(); }
        });
    });
}

function renderAdminForms() {
    const forms = getIntakeForms();
    const tbody = document.getElementById('admin-forms-tbody');
    const noEl = document.getElementById('admin-no-forms');
    if (!tbody) return;
    if (forms.length) {
        noEl.classList.add('hidden');
        tbody.innerHTML = forms.slice().reverse().map(f => `
            <tr>
                <td class="mono-text text-xs">${f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : '-'}</td>
                <td>${f.name || '-'}</td>
                <td class="mono-text text-xs">${f.email || '-'}</td>
                <td>${(f.goal || '-').toUpperCase()}</td>
                <td class="max-w-xs truncate">${f.message || '-'}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '';
        noEl.classList.remove('hidden');
    }
}

function renderAdminProgramsList() {
    const programs = getAdminPrograms();
    const el = document.getElementById('admin-programs-list');
    if (!el) return;
    el.innerHTML = programs.map((p) => {
        const pbId = resolveAdminProgramPrebuiltId(p);
        const editable = Boolean(pbId);
        const cardClass = editable
            ? 'program-card cursor-pointer border border-steel hover:border-rust/60 transition-colors focus:outline-none focus:ring-2 focus:ring-rust/40'
            : 'program-card';
        const attrs = editable
            ? `data-prebuilt-template-id="${pbId}" role="button" tabindex="0" title="Edit program template on public Programs page"`
            : '';
        return `
        <div class="${cardClass}" ${attrs}>
            <div class="flex justify-between items-start mb-2">
                <span class="badge badge-rust">${p.type}</span>
                <span class="mono-text text-xs text-gray-500">${p.clientCount || 0} clients</span>
            </div>
            <h3 class="display-text text-xl text-white mb-2">${p.name}</h3>
            <p class="text-gray-500 text-sm">${p.duration || '-'}</p>
            ${editable ? '<p class="mono-text text-xs text-rust mt-3 tracking-wide">Click to edit template →</p>' : ''}
        </div>
    `;
    }).join('');
}

function renderAdminWorkoutVideos() {
    const container = document.getElementById('admin-workout-videos-list');
    if (!container || typeof getWorkoutVideosSet !== 'function') return;
    const hasVideo = getWorkoutVideosSet();
    const customIds = getCustomWorkouts().map(w => w.id);
    const workouts = getAllWorkouts();
    container.innerHTML = workouts.map(w => {
        const has = hasVideo.includes(w.id);
        const isCustom = customIds.includes(w.id);
        return `<div class="flex flex-wrap items-center gap-4 py-2 border-b border-steel">
            <span class="mono-text text-xs text-white w-40">${w.title}</span>
            <span class="mono-text text-xs text-gray-500 max-w-[140px] truncate" title="${(w.subtitle || '').replace(/"/g, '&quot;')}">${w.subtitle || ''}</span>
            <input type="file" accept="video/*" class="admin-workout-video-file text-gray-500 text-xs max-w-[200px]" data-id="${w.id}">
            ${has ? `<span class="mono-text text-xs text-rust">Video added</span><button type="button" class="admin-workout-video-remove mono-text text-xs text-gray-500 hover:text-rust" data-id="${w.id}">Remove video</button>` : ''}
            ${isCustom ? `<button type="button" class="admin-workout-delete mono-text text-xs text-gray-500 hover:text-rust" data-id="${w.id}">Delete workout</button>` : ''}
        </div>`;
    }).join('');
    container.querySelectorAll('.admin-workout-video-file').forEach(input => {
        input.addEventListener('change', function() {
            const id = this.dataset.id;
            const file = this.files && this.files[0];
            if (!file || !id) return;
            saveWorkoutVideo(id, file).then(() => { renderAdminWorkoutVideos(); renderAdminVisibleWorkouts(); });
        });
    });
    container.querySelectorAll('.admin-workout-video-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (!id) return;
            deleteWorkoutVideo(id).then(() => { renderAdminWorkoutVideos(); renderAdminVisibleWorkouts(); });
        });
    });
    container.querySelectorAll('.admin-workout-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (!id) return;
            const custom = getCustomWorkouts().filter(w => w.id !== id);
            setCustomWorkouts(custom);
            const visible = getVisibleWorkouts().filter(vid => vid !== id);
            if (visible.length >= 1 && visible.length <= 3) setVisibleWorkouts(visible);
            deleteWorkoutVideo(id).catch(() => {});
            renderAdminWorkoutVideos();
            renderAdminVisibleWorkouts();
        });
    });
}

function renderAdminVisibleWorkouts() {
    const container = document.getElementById('admin-visible-workouts');
    const msgEl = document.getElementById('admin-visible-workouts-msg');
    if (!container) return;
    const selected = getVisibleWorkouts();
    const workouts = getAllWorkouts();
    container.innerHTML = workouts.map(w => {
        const checked = selected.includes(w.id);
        return `<label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="admin-visible-workout" data-id="${w.id}" ${checked ? 'checked' : ''}>
            <span class="mono-text text-xs text-gray-300">${w.title}</span>
        </label>`;
    }).join('');
    container.querySelectorAll('.admin-visible-workout').forEach(cb => {
        cb.addEventListener('change', () => {
            const current = container.querySelectorAll('.admin-visible-workout:checked');
            const ids = Array.from(current).map(c => c.dataset.id);
            if (ids.length > 3) {
                cb.checked = false;
                if (msgEl) { msgEl.textContent = 'Please select exactly 3 workouts.'; msgEl.classList.remove('hidden'); setTimeout(() => msgEl.classList.add('hidden'), 2000); }
                return;
            }
            if (ids.length >= 1 && ids.length <= 3) {
                setVisibleWorkouts(ids);
                if (msgEl) { msgEl.textContent = ids.length === 3 ? 'Saved. These 3 workouts will appear on the workout library.' : `Saved. ${ids.length} workout(s) selected. Pick 3 to fill the library.`; msgEl.classList.remove('hidden'); setTimeout(() => msgEl && msgEl.classList.add('hidden'), 2500); }
            } else {
                if (msgEl) msgEl.classList.add('hidden');
            }
        });
    });
}

function renderAdminMealPlanForms() {
    const forms = getMealPlanForms();
    const tbody = document.getElementById('admin-meal-plan-forms-tbody');
    const noEl = document.getElementById('admin-no-meal-plan-forms');
    if (!tbody) return;
    if (forms.length) {
        noEl.classList.add('hidden');
        tbody.innerHTML = forms.slice().reverse().map(f => `
            <tr>
                <td class="mono-text text-xs">${f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : '-'}</td>
                <td>${f.name || '-'}</td>
                <td class="mono-text text-xs">${f.email || '-'}</td>
                <td class="max-w-xs truncate">${f.goals || '-'}</td>
                <td class="mono-text text-xs">${f.age || '-'}</td>
                <td class="mono-text text-xs">${f.heightIn || '-'}</td>
                <td class="mono-text text-xs">${f.weight || '-'}</td>
                <td class="max-w-xs truncate">${f.exerciseHistory || '-'}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '';
        noEl.classList.remove('hidden');
    }
}

function renderAdminProgramRequests() {
    const requests = getProgramRequests();
    const applications = getApplications();
    const combined = [
        ...requests.map(r => ({ date: r.requestedAt, name: r.clientName, email: r.clientEmail, program: r.program, source: 'portal' })),
        ...applications.map(a => ({ date: a.appliedAt, name: a.name, email: a.email, program: a.interest, source: 'apply' }))
    ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const tbody = document.getElementById('admin-program-requests-tbody');
    const noEl = document.getElementById('admin-no-program-requests');
    if (!tbody) return;
    if (combined.length) {
        noEl.classList.add('hidden');
        tbody.innerHTML = combined.map(r => `
            <tr>
                <td class="mono-text text-xs">${r.date ? new Date(r.date).toLocaleDateString() : '-'}</td>
                <td>${r.name || '-'}</td>
                <td class="mono-text text-xs">${r.email || '-'}</td>
                <td><span class="badge badge-rust">${(r.program || '-').toUpperCase()}</span></td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '';
        noEl.classList.remove('hidden');
    }
}

function showAdminLogin() {
    document.getElementById('admin-login-screen').classList.remove('hidden');
    // Nav removed from admin portal
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function showAdminDashboard() {
    document.getElementById('admin-login-screen').classList.add('hidden');
    // Nav removed from admin portal
    document.getElementById('admin-dashboard').classList.remove('hidden');

    const clients = getAdminClients();
    const programs = getAdminPrograms();
    const sessions = getAdminSessions();

    document.getElementById('admin-clients-tbody').innerHTML = clients.map(c => `
        <tr>
            <td>${c.name}</td>
            <td class="mono-text text-xs">${c.email}</td>
            <td><span class="badge badge-rust">${c.programName}</span></td>
            <td class="mono-text text-xs">${c.startDate}</td>
        </tr>
    `).join('');

    renderAdminProgramsList();
    renderAdminVisibleWorkouts();
    renderAdminWorkoutVideos();

    // Hydrate "add client" program dropdown
    const clientProgramSelect = document.getElementById('admin-client-program');
    if (clientProgramSelect) {
        clientProgramSelect.innerHTML =
            '<option value="">Select program…</option>' +
            programs.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }

    const clientFilter = document.getElementById('admin-session-client');
    const uniqueEmails = [...new Set(sessions.map(s => s.clientEmail || 'client@example.com'))];
    clientFilter.innerHTML = '<option value="">All clients</option>' + uniqueEmails.map(e => {
        const client = clients.find(c => c.email === e);
        return `<option value="${e}">${client ? client.name : e}</option>`;
    }).join('');

    function renderSessions(filterEmail) {
        let list = sessions;
        if (filterEmail) list = list.filter(s => (s.clientEmail || 'client@example.com') === filterEmail);
        list.sort((a, b) => b.date.localeCompare(a.date));
        const clientByName = (email) => clients.find(c => c.email === email)?.name || email;
        document.getElementById('admin-sessions-tbody').innerHTML = list.slice(0, 30).map(s => `
            <tr>
                <td class="mono-text text-xs">${s.date}</td>
                <td>${clientByName(s.clientEmail || 'client@example.com')}</td>
                <td>${s.workout}</td>
                <td class="mono-text text-xs">${s.duration} min</td>
            </tr>
        `).join('');
    }

    renderSessions(clientFilter.value);
    clientFilter.addEventListener('change', () => renderSessions(clientFilter.value));

    adminCalMonth = new Date().getMonth();
    adminCalYear = new Date().getFullYear();
    renderAdminCalendar();
    renderAdminAppointments();
    renderAdminForms();
    renderAdminMealPlanForms();
    renderAdminProgramRequests();
}

// --- Admin: add client ---
document.getElementById('admin-add-client-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('admin-add-client-msg');
    if (msgEl) msgEl.classList.add('hidden');

    const name = document.getElementById('admin-client-name')?.value?.trim();
    const email = document.getElementById('admin-client-email')?.value?.trim();
    const password = document.getElementById('admin-client-password')?.value;
    const programId = document.getElementById('admin-client-program')?.value;
    const startDate = document.getElementById('admin-client-start-date')?.value;

    if (!name || !email || !password || !programId || !startDate) return;

    const programs = getAdminPrograms();
    const program = programs.find(p => p.id === programId);
    if (!program) return;

    // 1) Admin clients list (used for scheduling modal select + admin tables)
    const adminClients = getAdminClients();
    const existingIdx = adminClients.findIndex(c => (c.email || '').toLowerCase() === email.toLowerCase());
    const newClient = {
        id: existingIdx !== -1 ? adminClients[existingIdx].id : 'c' + Date.now(),
        name,
        email,
        programId: programId,
        programName: program.name,
        startDate
    };

    if (existingIdx !== -1) adminClients[existingIdx] = newClient;
    else adminClients.push(newClient);
    setAdminClients(adminClients);

    // 2) Client portal login accounts (used by client-portal login)
    const checkoutClients = getCheckoutClients();
    const existingPaidIdx = checkoutClients.findIndex(c => (c.email || '').toLowerCase() === email.toLowerCase());
    const paidClient = {
        email,
        name,
        password,
        programId,
        programName: program.name,
        paidAt: new Date().toISOString()
    };

    if (existingPaidIdx !== -1) checkoutClients[existingPaidIdx] = paidClient;
    else checkoutClients.push(paidClient);
    setCheckoutClients(checkoutClients);

    if (msgEl) {
        msgEl.textContent = 'Client added. They can sign in on the client portal.';
        msgEl.classList.remove('hidden');
    }

    // Refresh dashboard tables/selects if currently visible.
    renderAdminCalendar();
    renderAdminAppointments();
    showAdminDashboard();
});

// Tabs
document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.admin-tab').forEach(b => {
            b.classList.remove('text-rust', 'border-rust', 'active');
            b.classList.add('text-gray-500');
        });
        btn.classList.add('text-rust', 'border-rust', 'active');
        btn.classList.remove('text-gray-500');

        document.querySelectorAll('.admin-tab-panel').forEach(panel => panel.classList.add('hidden'));
        const panel = document.getElementById('tab-' + tab);
        if (panel) panel.classList.remove('hidden');
    });
});

document.getElementById('admin-cal-prev').addEventListener('click', () => {
    adminCalMonth--;
    if (adminCalMonth < 0) { adminCalMonth = 11; adminCalYear--; }
    renderAdminCalendar();
});
document.getElementById('admin-cal-next').addEventListener('click', () => {
    adminCalMonth++;
    if (adminCalMonth > 11) { adminCalMonth = 0; adminCalYear++; }
    renderAdminCalendar();
});

// --- Admin: add appointment modal ---
const adminApptModal = document.getElementById('admin-request-appointment-modal');
const adminApptForm = document.getElementById('admin-request-appointment-form');
const adminApptDate = document.getElementById('admin-appt-date');
const adminApptClientSelect = document.getElementById('admin-appt-client');
const adminApptTime = document.getElementById('admin-appt-time');
const adminApptType = document.getElementById('admin-appt-type');
const adminApptNotes = document.getElementById('admin-appt-notes');

function populateAdminClientSelect() {
    if (!adminApptClientSelect) return;
    const clients = getAdminClients();
    const options = [
        `<option value="">Select client…</option>`,
        ...clients.map((c) => `<option value="${c.email}">${c.name} (${c.email})</option>`)
    ];
    adminApptClientSelect.innerHTML = options.join('');
}

function openAdminAppointmentModal(dateStr) {
    if (!adminApptModal) return;
    if (!adminApptClientSelect) return;
    populateAdminClientSelect();

    if (adminApptDate) adminApptDate.value = dateStr || new Date().toISOString().slice(0, 10);

    adminApptModal.classList.remove('hidden');
    adminApptModal.classList.add('flex');

    // Focus for faster keyboard entry
    adminApptClientSelect.focus?.();
}

document.getElementById('admin-request-appointment-cancel')?.addEventListener('click', () => {
    if (!adminApptModal) return;
    adminApptModal.classList.add('hidden');
    adminApptModal.classList.remove('flex');
});

adminApptForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!adminApptDate || !adminApptClientSelect || !adminApptTime || !adminApptType) return;

    const date = adminApptDate.value;
    const clientEmail = adminApptClientSelect.value;
    if (!date || !clientEmail) return;

    const clients = getAdminClients();
    const client = clients.find((c) => (c.email || '').toLowerCase() === clientEmail.toLowerCase());
    if (!client) return;

    const timeSel = adminApptTime.value;
    const typeSel = adminApptType.value;
    const timeLabels = { morning: 'Morning (8–12)', afternoon: 'Afternoon (12–5)', evening: 'Evening (5–8)', flexible: 'Flexible' };
    const typeLabels = { 'check-in': 'Check-in call', 'in-person': 'In-person session', video: 'Video call', other: 'Other' };

    const appointments = getAppointments();
    appointments.push({
        id: String(Date.now()),
        date,
        time: timeLabels[timeSel] || timeSel,
        timeSlot: timeSel,
        type: typeLabels[typeSel] || typeSel,
        typeKey: typeSel,
        status: 'requested',
        notes: adminApptNotes?.value || '',
        createdAt: new Date().toISOString(),
        clientEmail: client.email,
        clientName: client.name
    });

    setAppointments(appointments);
    adminApptModal?.classList.add('hidden');
    adminApptModal?.classList.remove('flex');

    renderAdminAppointments();
    renderAdminCalendar();

    // Update day detail panel immediately (optional convenience)
    const detail = document.getElementById('admin-cal-detail');
    if (detail) {
        const dayAppts = getAppointments().filter((a) => a.date === date);
        if (!dayAppts.length) {
            detail.innerHTML = `<p class="mono-text text-sm text-gray-400">${date} - <span class="text-gray-500">No appointments scheduled.</span></p>`;
        } else {
            detail.innerHTML = `
                <p class="mono-text text-xs text-rust mb-2">${date}</p>
                <ul class="space-y-2">
                    ${dayAppts
                        .map((a) => {
                            const st = (a.status || 'requested').toLowerCase();
                            const cls =
                                st === 'approved'
                                    ? 'admin-status-approved'
                                    : st === 'denied'
                                      ? 'admin-status-denied'
                                      : 'admin-status-pending';
                            return `<li class="flex flex-wrap items-center gap-2 text-gray-300 text-sm">
                                <span>${a.time || '-'}</span>
                                <span>${a.clientName || a.clientEmail || 'Client'}</span>
                                <span class="admin-status ${cls}">${(a.status || 'requested').toUpperCase()}</span>
                            </li>`;
                        })
                        .join('')}
                </ul>`;
        }
    }
});

document.getElementById('admin-cal-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cal-date]');
    if (!btn) return;
    const dateStr = btn.dataset.calDate;
    document.querySelectorAll('#admin-cal-grid .cal-day-cell.is-selected').forEach((c) => c.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    const detail = document.getElementById('admin-cal-detail');
    if (!detail) return;
    const dayAppts = getAppointments().filter((a) => a.date === dateStr);
    if (!dayAppts.length) {
        detail.innerHTML = `<p class="mono-text text-sm text-gray-400">${dateStr} - <span class="text-gray-500">No appointments scheduled.</span></p>`;
        return;
    }
    detail.innerHTML = `
        <p class="mono-text text-xs text-rust mb-2">${dateStr}</p>
        <ul class="space-y-2">
            ${dayAppts.map((a) => {
                const st = (a.status || 'requested').toLowerCase();
                const cls = st === 'approved' ? 'admin-status-approved' : st === 'denied' ? 'admin-status-denied' : 'admin-status-pending';
                return `<li class="flex flex-wrap items-center gap-2 text-gray-300 text-sm">
                    <span>${a.time || '-'}</span>
                    <span>${a.clientName || a.clientEmail || 'Client'}</span>
                    <span class="admin-status ${cls}">${(a.status || 'requested').toUpperCase()}</span>
                </li>`;
            }).join('')}
        </ul>`;
    openAdminAppointmentModal(dateStr);
});

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errEl = document.getElementById('admin-login-error');

    // If Firebase is configured, use Firebase Auth for admin sign-in.
    if (window.FIREBASE_CONFIG) {
        try {
            const fb = await window.EthanCMS?.ensureFirebaseClient?.();
            if (!fb?.auth) throw new Error('Firebase auth not available');
            await fb.auth().signInWithEmailAndPassword(email, password);
            errEl.classList.add('hidden');
            setStoredAdmin({ email });
            showAdminDashboard();
            return;
        } catch (_) {
            errEl.classList.remove('hidden');
            return;
        }
    }

    // Fallback: demo admin credentials (localStorage-only).
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        errEl.classList.add('hidden');
        setStoredAdmin({ email });
        showAdminDashboard();
        return;
    }
    errEl.classList.remove('hidden');
});

document.getElementById('admin-logout').addEventListener('click', () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (window.FIREBASE_CONFIG) {
        try {
            window.EthanCMS?.ensureFirebaseClient?.().then((fb) => fb?.auth?.signOut?.());
        } catch (_) {}
    }
    showAdminLogin();
});

// Add workout form (Workouts tab)
document.getElementById('admin-add-workout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('admin-workout-title').value.trim().toUpperCase();
    const subtitle = document.getElementById('admin-workout-subtitle').value.trim();
    if (!title) return;
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const custom = getCustomWorkouts();
    if (custom.some(w => w.id === id)) {
        return;
    }
    custom.push({ id, title, subtitle: subtitle || '' });
    setCustomWorkouts(custom);
    renderAdminWorkoutVideos();
    renderAdminVisibleWorkouts();
    this.reset();
});

// Add program form
document.getElementById('admin-add-program-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('admin-program-name').value.trim();
    const type = document.getElementById('admin-program-type').value;
    const duration = document.getElementById('admin-program-duration').value.trim() || '-';
    if (!name) return;
    const programs = getAdminPrograms();
    const newId = 'p' + Date.now();
    programs.push({ id: newId, name, type, duration, clientCount: 0 });
    setAdminPrograms(programs);
    renderAdminProgramsList();
    this.reset();
});

// Init
initAdminPrebuiltTemplateEditor();
if (getStoredAdmin()) {
    showAdminDashboard();
} else {
    showAdminLogin();
}
