/**
 * IndexedDB for workout videos (admin uploads from device; workout library plays them).
 */
const WORKOUT_VIDEOS_DB = 'ethan_cope_workout_videos';
const WORKOUT_VIDEOS_STORE = 'videos';
const WORKOUT_VIDEOS_SET_KEY = 'ethan_cope_workout_videos_set';

function openWorkoutVideosDB() {
    return new Promise((resolve, reject) => {
        const r = indexedDB.open(WORKOUT_VIDEOS_DB, 1);
        r.onerror = () => reject(r.error);
        r.onsuccess = () => resolve(r.result);
        r.onupgradeneeded = (e) => {
            e.target.result.createObjectStore(WORKOUT_VIDEOS_STORE, { keyPath: 'id' });
        };
    });
}

function getWorkoutVideosSet() {
    try {
        const raw = localStorage.getItem(WORKOUT_VIDEOS_SET_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function setWorkoutVideosSet(ids) {
    localStorage.setItem(WORKOUT_VIDEOS_SET_KEY, JSON.stringify(ids));
}

function saveWorkoutVideo(id, blob) {
    return openWorkoutVideosDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(WORKOUT_VIDEOS_STORE, 'readwrite');
            const store = tx.objectStore(WORKOUT_VIDEOS_STORE);
            store.put({ id, blob });
            tx.oncomplete = () => {
                const set = getWorkoutVideosSet();
                if (!set.includes(id)) set.push(id);
                setWorkoutVideosSet(set);
                resolve();
            };
            tx.onerror = () => reject(tx.error);
        });
    });
}

function getWorkoutVideo(id) {
    return openWorkoutVideosDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(WORKOUT_VIDEOS_STORE, 'readonly');
            const req = tx.objectStore(WORKOUT_VIDEOS_STORE).get(id);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = () => reject(req.error);
        });
    });
}

function deleteWorkoutVideo(id) {
    return openWorkoutVideosDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(WORKOUT_VIDEOS_STORE, 'readwrite');
            tx.objectStore(WORKOUT_VIDEOS_STORE).delete(id);
            tx.oncomplete = () => {
                const set = getWorkoutVideosSet().filter(x => x !== id);
                setWorkoutVideosSet(set);
                resolve();
            };
            tx.onerror = () => reject(tx.error);
        });
    });
}
