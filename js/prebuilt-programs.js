/**
 * Program offerings aligned with index.html pricing grid.
 * Loads data from prebuilt-programs-data.js; merges localStorage overrides (admin-edited templates).
 */
const PREBUILT_PREVIEW_PER_DAY = 3;
const PREBUILT_OVERRIDES_KEY = 'ethan_cope_prebuilt_overrides';

function getPrebuiltBaseData() {
    const base = typeof window !== 'undefined' ? window.__PREBUILT_PROGRAMS_DATA__ : null;
    if (!base || !Array.isArray(base)) {
        console.error('Load js/prebuilt-programs-data.js before prebuilt-programs.js');
        return [];
    }
    return JSON.parse(JSON.stringify(base));
}

function getPrebuiltOverridesMap() {
    try {
        const raw = localStorage.getItem(PREBUILT_OVERRIDES_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/** Merge admin overrides into a base program entry */
function mergePrebuiltEntry(base, over) {
    if (!over) return base;
    const out = { ...base, ...over };
    if (Array.isArray(over.days)) out.days = JSON.parse(JSON.stringify(over.days));
    if (Array.isArray(over.importantNotes)) out.importantNotes = [...over.importantNotes];
    if (Array.isArray(over.features)) out.features = [...over.features];
    if (Array.isArray(over.sampleExercises)) out.sampleExercises = [...over.sampleExercises];
    if (Array.isArray(over.bundleIncludes)) out.bundleIncludes = [...over.bundleIncludes];
    return out;
}

function buildPrebuiltProgramsMerged() {
    const baseList = getPrebuiltBaseData();
    const overrides = getPrebuiltOverridesMap();
    return baseList.map((p) => mergePrebuiltEntry(JSON.parse(JSON.stringify(p)), overrides[p.id]));
}

let PREBUILT_PROGRAMS = buildPrebuiltProgramsMerged();

function previewExerciseNames(prog) {
    if (prog.kind !== 'template' || !prog.days?.length) return [];
    const first = prog.days[0].exercises || [];
    return first.slice(0, PREBUILT_PREVIEW_PER_DAY).map((e) => e.exercise);
}

function bundlePreviewNames() {
    const src = PREBUILT_PROGRAMS.find((p) => p.id === 'pb-fb3');
    return previewExerciseNames(src);
}

function renderPrebuiltCards() {
    const mount = document.getElementById('prebuilt-program-list');
    if (!mount) return;

    PREBUILT_PROGRAMS.forEach((prog) => {
        const card = document.createElement('div');
        const isElite = prog.kind === 'coaching' && prog.id === 'pb-coaching-online';
        const isBundle = prog.kind === 'bundle';
        card.className =
            'program-card prebuilt-program-card cursor-pointer border border-steel hover:border-rust/60 transition-colors duration-300 flex flex-col' +
            (isBundle ? ' border-rust/40' : '') +
            (isElite ? ' border-rust bg-gunmetal' : '');
        card.dataset.prebuiltId = prog.id;

        let previews = [];
        if (prog.kind === 'template') previews = previewExerciseNames(prog);
        else if (prog.kind === 'bundle') previews = bundlePreviewNames();
        else previews = prog.sampleExercises.slice(0, PREBUILT_PREVIEW_PER_DAY);

        const previewLabel =
            prog.kind === 'coaching' ? 'Sample focus areas' : prog.kind === 'bundle' ? 'Sample moves (Day 1 · Full Body 3×)' : 'Preview exercises (Day 1)';

        const previewHtml =
            previews.length > 0
                ? `<div class="mb-4 pt-1 border-t border-steel/60">
                <p class="mono-text text-[10px] tracking-[0.2em] text-gray-500 mb-2">${previewLabel}</p>
                <ul class="space-y-1.5 text-sm text-gray-400 leading-snug">
                    ${previews.map((n) => `<li class="flex gap-2"><span class="text-rust shrink-0">·</span><span>${n}</span></li>`).join('')}
                </ul>
            </div>`
                : '';

        const priceRow = `<div class="flex items-baseline gap-2 mt-auto pt-2 mb-4">
            <span class="display-text text-2xl md:text-3xl ${isElite ? 'text-rust' : 'text-white'}">${prog.priceDisplay}</span>
            <span class="mono-text text-xs text-gray-500">${prog.priceSuffix}</span>
        </div>`;

        card.innerHTML = `
            <div class="mono-text text-xs tracking-widest ${isElite ? 'text-rust' : isBundle ? 'text-rust' : 'text-gray-500'} mb-3">${prog.badge}</div>
            <h3 class="display-text text-xl md:text-2xl text-white mb-3 leading-tight">${prog.name}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-1">${prog.meta}</p>
            ${previewHtml}
            ${priceRow}
            <span class="text-rust mono-text text-xs tracking-widest">VIEW DETAILS →</span>
        `;
        mount.appendChild(card);
    });
}

function openBundleModal(prog) {
    const modal = document.getElementById('prebuilt-modal');
    if (!modal || !prog) return;

    document.getElementById('prebuilt-modal-title').textContent = prog.name;
    document.getElementById('prebuilt-modal-meta').textContent = prog.meta;

    const notesEl = document.getElementById('prebuilt-modal-notes');
    notesEl.innerHTML =
        '<h3 class="mono-text text-xs tracking-widest text-rust mb-3">INCLUDED TEMPLATES</h3><ul class="list-disc list-inside space-y-2 text-gray-300 text-sm">' +
        prog.bundleIncludes.map((n) => `<li>${n}</li>`).join('') +
        '</ul>';

    const previews = bundlePreviewNames();
    const daysEl = document.getElementById('prebuilt-modal-days');
    daysEl.innerHTML = `
        <section class="mb-6">
            <h4 class="display-text text-lg text-white mb-3">Sample prescription (first session)</h4>
            <p class="text-gray-500 text-sm mb-4">Same style of detail across all four programs: tempo, sets, reps, RIR, and cues.</p>
            <ul class="space-y-2 text-gray-400 text-sm border border-steel/60 bg-gunmetal/30 p-4">
                ${previews.map((n) => `<li class="flex gap-2"><span class="text-rust">·</span>${n}</li>`).join('')}
            </ul>
        </section>`;

    const footerCta = document.getElementById('prebuilt-modal-footer-cta');
    if (footerCta) {
        footerCta.innerHTML = `
            <p class="text-gray-500 text-sm mb-4">Save vs buying each template separately.</p>
            <div class="flex flex-wrap gap-3">
                <a href="checkout.html?program=${encodeURIComponent(prog.checkoutQuery)}" class="magnetic-btn inline-block" data-magnetic><span>${prog.purchaseLabel}</span></a>
                <a href="index.html#contact" class="bottom-cta-secondary !py-3">QUESTIONS → CONTACT</a>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openCoachingModal(prog) {
    const modal = document.getElementById('prebuilt-modal');
    if (!modal || !prog) return;

    document.getElementById('prebuilt-modal-title').textContent = prog.name;
    document.getElementById('prebuilt-modal-meta').textContent = prog.meta;

    document.getElementById('prebuilt-modal-notes').innerHTML =
        '<h3 class="mono-text text-xs tracking-widest text-rust mb-3">WHAT YOU GET</h3><ul class="list-disc list-inside space-y-2 text-gray-400 text-sm leading-relaxed">' +
        prog.features.map((f) => `<li>${f}</li>`).join('') +
        '</ul>';

    document.getElementById('prebuilt-modal-days').innerHTML = `
        <section class="mb-6">
            <h4 class="display-text text-lg text-white mb-3">What training looks like</h4>
            <ul class="space-y-2 text-gray-400 text-sm border border-steel/60 bg-gunmetal/30 p-4">
                ${prog.sampleExercises.map((n) => `<li class="flex gap-2"><span class="text-rust">·</span>${n}</li>`).join('')}
            </ul>
        </section>`;

    const footerCta = document.getElementById('prebuilt-modal-footer-cta');
    if (footerCta) {
        footerCta.innerHTML = `
            <div class="flex flex-wrap gap-3">
                <a href="index.html#contact" class="magnetic-btn inline-block" data-magnetic><span>APPLY / CONTACT</span></a>
                <a href="client-portal.html" class="mono-text text-xs tracking-widest text-gray-500 hover:text-rust py-3 px-2 inline-flex items-center border border-transparent hover:border-steel transition-colors">CLIENT PORTAL →</a>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openPrebuiltModal(prog) {
    if (!prog) return;
    if (prog.kind === 'bundle') {
        openBundleModal(prog);
        return;
    }
    if (prog.kind === 'coaching') {
        openCoachingModal(prog);
        return;
    }

    const modal = document.getElementById('prebuilt-modal');
    if (!modal) return;

    document.getElementById('prebuilt-modal-title').textContent = prog.name;
    document.getElementById('prebuilt-modal-meta').textContent = prog.meta;

    const notesEl = document.getElementById('prebuilt-modal-notes');
    notesEl.innerHTML =
        '<h3 class="mono-text text-xs tracking-widest text-rust mb-3">IMPORTANT NOTES</h3><ul class="list-disc list-inside space-y-2 text-gray-400 text-sm leading-relaxed">' +
        prog.importantNotes.map((n) => `<li>${n}</li>`).join('') +
        '</ul>';

    const daysEl = document.getElementById('prebuilt-modal-days');
    daysEl.innerHTML = prog.days
        .map((day) => {
            const all = day.exercises;
            const preview = all.slice(0, PREBUILT_PREVIEW_PER_DAY);
            const hidden = Math.max(0, all.length - PREBUILT_PREVIEW_PER_DAY);
            const rows = preview
                .map(
                    (exR) => `
                <tr class="border-b border-steel/80 align-top">
                    <td class="py-3 pr-3 text-white text-sm font-medium">${exR.exercise}</td>
                    <td class="py-3 pr-3 text-gray-400 text-sm whitespace-nowrap">${exR.setsReps}</td>
                    <td class="py-3 pr-3 text-rust text-xs mono-text">${exR.rir}</td>
                    <td class="py-3 text-gray-500 text-sm">${exR.cues}</td>
                </tr>`
                )
                .join('');

            const lockBlock =
                hidden > 0
                    ? `<div class="mt-4 p-4 bg-gunmetal/80 border border-steel rounded-sm">
                    <p class="mono-text text-xs text-gray-400 mb-3 tracking-wide">+${hidden} more exercise${
                          hidden !== 1 ? 's' : ''
                      } in this session. Full template after purchase.</p>
                    <div class="flex flex-wrap gap-3">
                        <a href="checkout.html?program=${encodeURIComponent(prog.checkoutQuery)}" class="magnetic-btn inline-block text-sm py-3 px-5" data-magnetic><span>${prog.purchaseLabel}</span></a>
                        <a href="index.html#contact" class="mono-text text-xs tracking-widest text-gray-500 hover:text-rust py-3 px-2 inline-flex items-center border border-transparent hover:border-steel transition-colors">QUESTIONS → CONTACT</a>
                    </div>
                </div>`
                    : '';

            return `
            <section class="mb-10 last:mb-0">
                <h4 class="display-text text-lg text-white mb-4">${day.title}</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-left prebuilt-table min-w-[640px]">
                        <thead>
                            <tr class="border-b border-steel mono-text text-[10px] tracking-widest text-gray-500 uppercase">
                                <th class="pb-3 pr-3 font-normal">Exercise &amp; tempo</th>
                                <th class="pb-3 pr-3 font-normal">Sets × reps</th>
                                <th class="pb-3 pr-3 font-normal">RIR</th>
                                <th class="pb-3 font-normal">Cues</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
                ${lockBlock}
            </section>`;
        })
        .join('');

    const footerCta = document.getElementById('prebuilt-modal-footer-cta');
    if (footerCta) {
        footerCta.innerHTML = `
            <p class="text-gray-500 text-sm mb-4">Get the complete ${prog.name} with every exercise and full prescriptions.</p>
            <div class="flex flex-wrap gap-3">
                <a href="checkout.html?program=${encodeURIComponent(prog.checkoutQuery)}" class="magnetic-btn inline-block" data-magnetic><span>${prog.purchaseLabel}</span></a>
                <a href="index.html#contact" class="bottom-cta-secondary !py-3">APPLY / CONTACT</a>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePrebuiltModal() {
    const modal = document.getElementById('prebuilt-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function initPrebuiltPrograms() {
    renderPrebuiltCards();

    const list = document.getElementById('prebuilt-program-list');
    if (list) {
        list.addEventListener('click', (e) => {
            const card = e.target.closest('[data-prebuilt-id]');
            if (!card) return;
            const prog = PREBUILT_PROGRAMS.find((p) => p.id === card.dataset.prebuiltId);
            openPrebuiltModal(prog);
        });
    }

    document.getElementById('prebuilt-modal-close')?.addEventListener('click', closePrebuiltModal);
    document.getElementById('prebuilt-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'prebuilt-modal') closePrebuiltModal();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrebuiltPrograms);
} else {
    initPrebuiltPrograms();
}
