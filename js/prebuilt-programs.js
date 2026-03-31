/**
 * Pre-built program templates: full data + preview (first N exercises per day).
 * Shown on programs.html above the training blocks grid.
 */
const PREBUILT_PREVIEW_PER_DAY = 3;

const PREBUILT_PROGRAMS = [
    {
        id: 'pb-full-body-ab-3x',
        name: 'Full Body A / B (3× per week)',
        badge: 'TEMPLATE',
        meta: 'Full Body A → Rest → Full Body B → Rest → Rest → repeat',
        checkoutQuery: 'template-fb3',
        importantNotes: [
            'Take at least 48 hours between workouts.',
            'Priority muscle groups go first in the workouts.',
            'Tempo (e.g. 2-1-0-1): 2s eccentric, 1s pause at bottom, explode up, 1s pause at top.',
            'RIR = Reps in Reserve (how many reps left in the tank). Example: 1 RIR means you could only do one more rep at end of set.',
            'Double progression: pick a weight that lands you at the bottom of the rep range (e.g. 6 reps). Add weight only when you can hit the top of the range (e.g. 10 reps), then repeat.',
            'These routines need consistency. Food, sleep, and hydration must be dialed in.',
            'Run as: Full Body A / Rest / Full Body B / Rest / Rest — then repeat (3 workouts per week).'
        ],
        days: [
            {
                title: 'Day 1 (Full Body A)',
                exercises: [
                    {
                        exercise: 'Barbell RDLs (3001 Tempo)',
                        setsReps: '1–2 Sets × 6–10 Reps',
                        rir: '1 RIR both sets',
                        cues: 'Pressure through midfoot (not all the way back on heels), snap the bar like a pencil, push tailbone up and back on the way down.'
                    },
                    {
                        exercise: 'Neutral Grip Machine Press (3100 Tempo)',
                        setsReps: '2 Sets × 6–10 Reps',
                        rir: '1 RIR first set, 0 RIR second set',
                        cues: 'Shoulders down, pressure between index finger and thumb, drive biceps together.'
                    },
                    {
                        exercise: 'Unilateral Leg Press (3000 Tempo)',
                        setsReps: '1 Set × 6–10 Reps',
                        rir: '1 RIR',
                        cues: 'Feet low, pull body into seat, drive through big toe.'
                    },
                    {
                        exercise: 'Neutral Grip Chest Supported Rows (3000 Tempo)',
                        setsReps: '2–3 Sets × 6–10 Reps',
                        rir: '0–1 RIR first set, 0 RIR last set',
                        cues: 'Pressure through index finger, chest and spine tall, reduce pressure through feet to limit lower-back engagement.'
                    },
                    {
                        exercise: 'Leg Extensions (2000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Pull body into seat (seatbelt helps if available), stack ankles–knees–hips, drive toes up toward ceiling.'
                    },
                    {
                        exercise: 'Single Arm Cable Lateral Raises (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Lead with elbow, drive back of hand up and away.'
                    },
                    {
                        exercise: 'EZ Bar Tricep Extensions (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Keep upper arms by your sides, drive through the outside of the hands.'
                    },
                    {
                        exercise: 'Seated DB Curls Supinated (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'First set 1 RIR, last set 0 RIR',
                        cues: 'Palms up, curl through pinkies, upper arms by sides (slight shoulder flexion is OK).'
                    },
                    {
                        exercise: 'Machine Abductors (3100 Tempo)',
                        setsReps: '1 Set × 6–10 Reps',
                        rir: '0 RIR',
                        cues: 'Pull body into seat, drive knees out.'
                    }
                ]
            },
            {
                title: 'Day 2 (Full Body B)',
                exercises: [
                    {
                        exercise: 'Smith Machine Squats (3001 Tempo)',
                        setsReps: '1 Set × 6–10 Reps',
                        rir: '1 RIR',
                        cues: 'Chest up, back and pelvis neutral, knees over toes on eccentric, drive up through big toe.'
                    },
                    {
                        exercise: 'Machine Overhead Press (3000 Tempo)',
                        setsReps: '2 Sets × 6–10 Reps',
                        rir: '1 RIR first set, 0 RIR second set',
                        cues: 'Pelvis and spine stacked, feet into floor, handle pressure between thumb and index finger.'
                    },
                    {
                        exercise: 'Machine B-Stance Hip Thrusts (3000 Tempo)',
                        setsReps: '1 Set × 6–10 Reps',
                        rir: '0 RIR',
                        cues: 'Working foot flat, non-working foot toes up, drive through hips, pressure through midfoot.'
                    },
                    {
                        exercise: 'Wide Grip Lat Pulldowns (3000 Tempo)',
                        setsReps: '2 Sets × 6–10 Reps',
                        rir: '0–1 RIR first set, 0 RIR last set',
                        cues: 'Spine neutral, chin neutral (not fully tucked), pressure through pinkies, elbows down toward hips.'
                    },
                    {
                        exercise: 'Seated Leg Curls (3100 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Push body back into seat, drive heels to glutes.'
                    },
                    {
                        exercise: 'Pec Deck Flies (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Spine and pelvis stacked, pressure between index finger and thumb, same elbow flexion throughout.'
                    },
                    {
                        exercise: 'Machine Wide Grip Rows (3100 Tempo)',
                        setsReps: '2 Sets × 6–10 Reps',
                        rir: 'First set 1 RIR, second set 0 RIR',
                        cues: 'Spine long, chest slightly up, pressure through index finger, initiate by squeezing shoulder blades.'
                    },
                    {
                        exercise: 'Flat DB Skullcrushers (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Arms straight up, slide hands to dumbbell edges, drive through back of hands.'
                    },
                    {
                        exercise: 'Single Arm DB Hammer Curls (3000 Tempo)',
                        setsReps: '2 Sets × 8–12 Reps',
                        rir: 'Both sets to 0 RIR',
                        cues: 'Drive hand toward shoulder.'
                    },
                    {
                        exercise: 'Machine Adductors (3000 Tempo)',
                        setsReps: '1 Set × 6–10 Reps',
                        rir: '0 RIR',
                        cues: 'Pull body into seat, drive knees together.'
                    }
                ]
            }
        ]
    }
];

function renderPrebuiltCards() {
    const mount = document.getElementById('prebuilt-program-list');
    if (!mount) return;

    PREBUILT_PROGRAMS.forEach((prog) => {
        const card = document.createElement('div');
        card.className =
            'program-card prebuilt-program-card cursor-pointer border border-steel hover:border-rust/60 transition-colors duration-300';
        card.dataset.prebuiltId = prog.id;
        const d1Count = prog.days[0]?.exercises.length || 0;
        const d2Count = prog.days[1]?.exercises.length || 0;
        card.innerHTML = `
            <div class="mono-text text-xs tracking-widest text-rust mb-3">${prog.badge}</div>
            <h3 class="display-text text-xl md:text-2xl text-white mb-3">${prog.name}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-4">${prog.meta}</p>
            <p class="mono-text text-xs text-gray-600 mb-4">
                Preview: first ${PREBUILT_PREVIEW_PER_DAY} exercises per day · Full program · Day A: ${d1Count} moves · Day B: ${d2Count} moves
            </p>
            <span class="text-rust mono-text text-xs tracking-widest">VIEW PREVIEW →</span>
        `;
        mount.appendChild(card);
    });
}

function openPrebuiltModal(prog) {
    const modal = document.getElementById('prebuilt-modal');
    if (!modal || !prog) return;

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
                    (ex) => `
                <tr class="border-b border-steel/80 align-top">
                    <td class="py-3 pr-3 text-white text-sm font-medium">${ex.exercise}</td>
                    <td class="py-3 pr-3 text-gray-400 text-sm whitespace-nowrap">${ex.setsReps}</td>
                    <td class="py-3 pr-3 text-rust text-xs mono-text">${ex.rir}</td>
                    <td class="py-3 text-gray-500 text-sm">${ex.cues}</td>
                </tr>`
                )
                .join('');

            const lockBlock =
                hidden > 0
                    ? `<div class="mt-4 p-4 bg-gunmetal/80 border border-steel rounded-sm">
                    <p class="mono-text text-xs text-gray-400 mb-3 tracking-wide">+${hidden} more exercise${
                          hidden !== 1 ? 's' : ''
                      } in this session — included in the full program after purchase.</p>
                    <div class="flex flex-wrap gap-3">
                        <a href="checkout.html?program=${encodeURIComponent(prog.checkoutQuery)}" class="magnetic-btn inline-block text-sm py-3 px-5" data-magnetic><span>BUY PROGRAM ($30)</span></a>
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
            <p class="text-gray-500 text-sm mb-4">Get the complete ${prog.name} with every exercise, all sets, and full prescriptions.</p>
            <div class="flex flex-wrap gap-3">
                <a href="checkout.html?program=${encodeURIComponent(prog.checkoutQuery)}" class="magnetic-btn inline-block" data-magnetic><span>PURCHASE FULL PROGRAM</span></a>
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
