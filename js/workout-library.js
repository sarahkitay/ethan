const WORKOUTS = [
    {
        id: 'w1',
        name: 'HYROX Race Sim',
        focus: 'hyrox',
        duration: 75,
        description: 'Full race simulation with 1k run + station. Use for pacing and mental rehearsal.',
        exercises: [
            { name: '1K Run', sets: '1', reps: '1K', notes: 'Target race pace' },
            { name: '1000m Ski Erg', sets: '1', reps: '1000m', notes: 'Smooth, controlled' },
            { name: '50m Sled Push', sets: '1', reps: '50m', notes: 'Heavy sled' },
            { name: '50m Sled Pull', sets: '1', reps: '50m', notes: '' },
            { name: '80m Burpee Broad Jump', sets: '1', reps: '80m', notes: '' },
            { name: '1000m Row', sets: '1', reps: '1000m', notes: '' },
            { name: '200m Farmers Carry', sets: '1', reps: '200m', notes: 'Heavy' },
            { name: '100m Sandbag Lunges', sets: '1', reps: '100m', notes: '' },
            { name: '75 Wall Balls', sets: '1', reps: '75', notes: '9kg' },
            { name: '1K Run', sets: '1', reps: '1K', notes: 'Finish strong' }
        ]
    },
    {
        id: 'w2',
        name: 'Upper Push Strength',
        focus: 'strength',
        duration: 45,
        description: 'Heavy pressing focus. Rest 2–3 min between main sets.',
        exercises: [
            { name: 'Bench Press', sets: '4', reps: '5', notes: 'RPE 8' },
            { name: 'Overhead Press', sets: '3', reps: '6', notes: 'Strict' },
            { name: 'Incline DB Press', sets: '3', reps: '8', notes: '' },
            { name: 'Tricep Dips', sets: '3', reps: '10', notes: 'Weighted optional' },
            { name: 'Cable Fly', sets: '2', reps: '12', notes: 'Pump' }
        ]
    },
    {
        id: 'w3',
        name: 'Engine Builder',
        focus: 'conditioning',
        duration: 40,
        description: 'Sustained effort to build work capacity. Keep heart rate in zone 3–4.',
        exercises: [
            { name: 'Assault Bike', sets: '1', reps: '5 min', notes: 'Steady' },
            { name: 'Row', sets: '1', reps: '2000m', notes: 'Negative split' },
            { name: 'Ski Erg', sets: '1', reps: '1000m', notes: 'Smooth' },
            { name: 'Assault Bike', sets: '1', reps: '5 min', notes: 'Finish strong' }
        ]
    },
    {
        id: 'w4',
        name: '5K Tempo Run',
        focus: 'running',
        duration: 35,
        description: 'Tempo effort at 80–85% of 5K pace. Focus on rhythm.',
        exercises: [
            { name: 'Easy Jog', sets: '1', reps: '10 min', notes: 'Warm-up' },
            { name: '5K Run', sets: '1', reps: '5K', notes: 'Tempo pace' },
            { name: 'Walk / Stretch', sets: '1', reps: '5 min', notes: 'Cool-down' }
        ]
    },
    {
        id: 'w5',
        name: 'Erg Power Intervals',
        focus: 'erg',
        duration: 50,
        description: 'Short, high-power intervals on rower and ski erg. Full recovery between.',
        exercises: [
            { name: 'Row 500m', sets: '6', reps: '500m', notes: '2 min rest' },
            { name: 'Ski Erg 250m', sets: '6', reps: '250m', notes: '90 sec rest' }
        ]
    },
    {
        id: 'w6',
        name: 'Lower + Core',
        focus: 'strength',
        duration: 55,
        description: 'Squat pattern and posterior chain with core finisher.',
        exercises: [
            { name: 'Back Squat', sets: '4', reps: '5', notes: 'RPE 8' },
            { name: 'RDL', sets: '3', reps: '8', notes: 'Controlled eccentric' },
            { name: 'Leg Press', sets: '3', reps: '10', notes: '' },
            { name: 'Leg Curl', sets: '2', reps: '12', notes: '' },
            { name: 'Plank', sets: '3', reps: '60s', notes: '' },
            { name: 'Dead Bug', sets: '2', reps: '12/side', notes: '' }
        ]
    },
    {
        id: 'w7',
        name: 'Sandbag & Sled',
        focus: 'hyrox',
        duration: 45,
        description: 'HYROX-specific implement work. Practice transitions.',
        exercises: [
            { name: 'Sandbag Lunges', sets: '4', reps: '50m', notes: 'Heavy' },
            { name: 'Sled Push', sets: '4', reps: '40m', notes: 'Heavy' },
            { name: 'Sled Pull', sets: '4', reps: '40m', notes: '' },
            { name: 'Sandbag Carry', sets: '3', reps: '100m', notes: '' }
        ]
    },
    {
        id: 'w8',
        name: 'Pull & Grip',
        focus: 'strength',
        duration: 50,
        description: 'Horizontal and vertical pull with grip work.',
        exercises: [
            { name: 'Barbell Row', sets: '4', reps: '6', notes: 'Heavy' },
            { name: 'Pull-ups', sets: '3', reps: '8', notes: 'Weighted optional' },
            { name: 'Lat Pulldown', sets: '3', reps: '10', notes: '' },
            { name: 'Face Pull', sets: '2', reps: '15', notes: 'External rotation' },
            { name: 'Farmer Carry', sets: '3', reps: '60m', notes: 'Heavy' }
        ]
    },
    {
        id: 'w9',
        name: 'Quick Conditioning',
        focus: 'conditioning',
        duration: 25,
        description: 'Short, sharp session when time is limited.',
        exercises: [
            { name: 'Burpees', sets: '5', reps: '10', notes: 'On the 1:00' },
            { name: 'Row', sets: '5', reps: '250m', notes: 'Max effort, 1:00 rest' }
        ]
    },
    {
        id: 'w10',
        name: 'Mobility & Accessory',
        focus: 'accessory',
        duration: 30,
        description: 'Prehab and movement quality. Light load, focus on position.',
        exercises: [
            { name: 'Band Pull-apart', sets: '3', reps: '20', notes: '' },
            { name: 'Hip Mobility Circuit', sets: '2', reps: '5 min', notes: '' },
            { name: 'Pallof Hold', sets: '2', reps: '30s/side', notes: '' },
            { name: 'Cossack Squat', sets: '2', reps: '8/side', notes: '' }
        ]
    }
];

function renderWorkouts(workouts) {
    const list = document.getElementById('workout-list');
    const noResults = document.getElementById('no-results');
    list.innerHTML = '';

    if (!workouts.length) {
        noResults.classList.remove('hidden');
        return;
    }
    noResults.classList.add('hidden');

    workouts.forEach(w => {
        const card = document.createElement('div');
        card.className = 'program-card workout-library-card cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(131,177,243,0.12)]';
        card.dataset.id = w.id;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="badge badge-rust">${w.focus.toUpperCase()}</span>
                <span class="mono-text text-xs text-gray-500">${w.duration} MIN</span>
            </div>
            <h3 class="display-text text-xl text-white mb-2 group-hover:text-rust transition-colors">${w.name}</h3>
            <p class="text-gray-500 text-sm line-clamp-2">${w.description}</p>
        `;
        list.appendChild(card);
    });
}

function filterWorkouts() {
    const focus = document.getElementById('filter-focus').value;
    const duration = document.getElementById('filter-duration').value;

    let filtered = WORKOUTS.filter(w => {
        if (focus && w.focus !== focus) return false;
        if (duration && w.duration > parseInt(duration, 10)) return false;
        return true;
    });
    renderWorkouts(filtered);
}

function openModal(workout) {
    const modal = document.getElementById('workout-modal');
    document.getElementById('modal-badge').textContent = workout.focus.toUpperCase();
    document.getElementById('modal-title').textContent = workout.name;
    document.getElementById('modal-meta').textContent = `${workout.duration} MIN`;
    document.getElementById('modal-description').textContent = workout.description;

    const exEl = document.getElementById('modal-exercises');
    const firstThree = workout.exercises.slice(0, 3);
    exEl.innerHTML = firstThree.map(e =>
        `<div class="flex justify-between items-start border-b border-steel pb-2">
            <div>
                <span class="text-white font-medium">${e.name}</span>
                ${e.notes ? `<span class="text-gray-500 text-sm block">${e.notes}</span>` : ''}
            </div>
            <span class="mono-text text-xs text-rust whitespace-nowrap ml-4">${e.sets} × ${e.reps}</span>
        </div>`
    ).join('') + `
        <div class="mt-6 pt-6 border-t border-steel">
            <p class="mono-text text-xs text-gray-500 mb-3">Purchase a program or get access to all programs for the full workout.</p>
            <a href="index.html#contact" class="inline-flex items-center gap-2 text-rust mono-text text-xs tracking-widest hover:opacity-80 transition-opacity">
                GET FULL ACCESS →
            </a>
        </div>`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

document.getElementById('filter-focus').addEventListener('change', filterWorkouts);
document.getElementById('filter-duration').addEventListener('change', filterWorkouts);
document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('filter-focus').value = '';
    document.getElementById('filter-duration').value = '';
    filterWorkouts();
});

document.getElementById('workout-list').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const w = WORKOUTS.find(x => x.id === card.dataset.id);
    if (w) openModal(w);
});

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('workout-modal').classList.add('hidden');
    document.getElementById('workout-modal').classList.remove('flex');
});
document.getElementById('workout-modal').addEventListener('click', (e) => {
    if (e.target.id === 'workout-modal') {
        document.getElementById('workout-modal').classList.add('hidden');
        document.getElementById('workout-modal').classList.remove('flex');
    }
});

// Initial render
filterWorkouts();
