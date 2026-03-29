# Ethan Cope | Performance Architect

Multi-page site for Ethan Cope, Performance Architect: homepage, workout library, client portal, and admin portal.

## Structure

- **index.html** Homepage (hero, method, programs, results, contact)
- **workout-library.html** Filterable workout library (focus, duration) with exercise detail modal
- **client-portal.html** Client sign-in, current program, session log, and “log session” flow
- **admin-portal.html** Admin sign-in, clients list, programs list, and sessions (filterable by client)

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

## Demo logins

- **Client portal:** `client@example.com` / `client123`
- **Admin portal:** `admin@ethancope.com` / `admin123`

Client data (program, sessions) and admin data (clients, programs, sessions) are stored in `localStorage` for demo purposes. Session log entries from the client portal appear in the admin Sessions tab.

## Tech

- Vanilla HTML, Tailwind via CDN, shared CSS in `css/shared.css`
- GSAP + ScrollTrigger + Three.js only on the homepage (`js/home.js`)
- `js/shared.js` magnetic buttons and shared UI on inner pages
- `js/workout-library.js` workout data and filtering
- `js/client-portal.js` client auth and session log (localStorage)
- `js/admin-portal.js` admin auth, clients, programs, sessions (localStorage)

## Adding a backend

Replace localStorage in `client-portal.js` and `admin-portal.js` with API calls (e.g. REST or GraphQL) for auth, programs, and sessions. Keep the same UI and swap the data layer.
