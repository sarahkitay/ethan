/**
 * Workout library: show 3 visible workouts with admin-uploaded videos (autoplay muted).
 * Click opens fullscreen modal with sound and controls.
 */
const VISIBLE_WORKOUTS_KEY = 'ethan_cope_visible_workouts';
const CUSTOM_WORKOUTS_KEY = 'ethan_cope_custom_workouts';

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

function getCustomWorkouts() {
    try {
        const raw = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function getAllWorkouts() {
    return ALL_WORKOUTS.concat(getCustomWorkouts());
}

function getVisibleWorkoutIds() {
    try {
        const raw = localStorage.getItem(VISIBLE_WORKOUTS_KEY);
        if (raw) {
            const ids = JSON.parse(raw);
            if (Array.isArray(ids) && ids.length >= 1) return ids.slice(0, 3);
        }
    } catch {}
    return getAllWorkouts().slice(0, 3).map(w => w.id);
}

function renderWorkoutLibrary() {
    const grid = document.getElementById('workout-video-grid');
    const modal = document.getElementById('workout-video-modal');
    const modalVideo = document.getElementById('workout-video-modal-video');
    const modalClose = document.getElementById('workout-video-modal-close');
    if (!grid) return;

    const visibleIds = getVisibleWorkoutIds();
    const allWorkouts = getAllWorkouts();
    const workouts = visibleIds.map(id => allWorkouts.find(w => w.id === id)).filter(Boolean);
    if (!workouts.length) {
        grid.innerHTML = '<p class="mono-text text-gray-500">No workouts selected. Admin can pick 3 in the Programs tab.</p>';
        return;
    }

    Promise.all(workouts.map(w => getWorkoutVideo(w.id))).then(blobs => {
        const objectUrls = [];
        const cards = workouts.map((w, i) => {
            const blob = blobs[i];
            const url = blob ? URL.createObjectURL(blob) : null;
            if (url) objectUrls.push(url);
            const hasVideo = !!url;
            return {
                ...w,
                videoUrl: url,
                hasVideo
            };
        });

        grid.innerHTML = cards.map(c => `
            <div class="video-card group block border border-steel bg-gunmetal overflow-hidden transition-colors hover:border-rust cursor-pointer" data-id="${c.id}" data-has-video="${c.hasVideo}">
                <div class="aspect-video bg-steel flex items-center justify-center overflow-hidden">
                    ${c.hasVideo
                        ? `<video class="w-full h-full object-cover" src="${c.videoUrl}" autoplay muted loop playsinline></video>`
                        : '<span class="mono-text text-xs text-gray-600 group-hover:text-rust transition-colors">VIDEO COMING SOON</span>'
                    }
                </div>
                <div class="p-4">
                    <h3 class="display-text text-lg text-white group-hover:text-rust transition-colors">${c.title}</h3>
                    <p class="mono-text text-xs text-gray-500 mt-1">${c.subtitle}</p>
                    ${c.hasVideo ? '<p class="mono-text text-xs text-rust mt-2">Click for full video with sound</p>' : ''}
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.video-card[data-has-video="true"]').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const cardData = cards.find(c => c.id === id);
                if (!cardData || !cardData.videoUrl) return;
                if (modalVideo) {
                    modalVideo.src = cardData.videoUrl;
                    modalVideo.muted = false;
                    modalVideo.controls = true;
                    modalVideo.play();
                }
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                if (modalVideo) {
                    modalVideo.pause();
                    modalVideo.src = '';
                }
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modalVideo) { modalVideo.pause(); modalVideo.src = ''; }
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }

        window._workoutLibraryObjectUrls = objectUrls;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWorkoutLibrary);
} else {
    renderWorkoutLibrary();
}
