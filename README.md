# InfraWatch

AI-Assisted Integrated Infrastructure Project Monitoring — now with a real backend
and a password-protected Admin Panel.

## What changed

- **`server/data.json` is now the live database.** It's read and written by a small
  Express API (`server/index.js`) instead of only living in the browser's
  `localStorage`. Every project you add, edit, or delete is saved to that file, so
  the data is the same for every visitor, not just your own browser.
- **Public dashboard (`/`)** — read-only. Anyone can view the ledger, filter by
  role view, and inspect corrective-action issues, but cannot add/edit/delete.
- **Admin Panel (`/admin`)** — password-protected. Logging in unlocks the full
  Add / Edit / Delete workflow, wired directly to the API.

## Setup

```bash
npm install
```

## Running in development

This now runs two processes: the Vite dev server (frontend) and the Express API
(backend). The frontend dev server proxies `/api/*` requests to the backend.

```bash
npm run dev:all
```

This starts both together. Frontend: http://localhost:5173 — Backend API:
http://localhost:5000.

(You can also run them separately in two terminals: `npm run server` and `npm run dev`.)

## Admin login

Default admin password: **`infrawatch2026`**

Change it before sharing this anywhere real — either edit `ADMIN_PASSWORD` in
`server/index.js`, or set an environment variable instead:

```bash
ADMIN_PASSWORD=your-new-password npm run server
```

Go to `/admin` in the app to log in.

## Production build

```bash
npm run build   # builds the frontend into dist/
npm start       # runs the Express server, which serves dist/ AND the API
```

In production, everything is served from one server (default port 5000, override
with `PORT=xxxx`).

## Project structure

```
server/
  index.js       Express API (auth, CRUD, serves the built frontend)
  data.json      The live database file
src/
  api.js               fetch() wrappers for the API
  useProjects.js        public read-only data hook
  riskEngine.js         risk/freshness/currency helpers (shared)
  utils.jsx              shared <Stamp> / <Freshness> components
  components/            SummaryStrip, Ledger, IssuePanel (shared by public + admin)
  ProjectForm.jsx        add/edit form (used only in Admin)
  admin/
    useAdminAuth.js       login/logout/session hook
    useAdminProjects.js   authenticated CRUD hook
    AdminLogin.jsx
    AdminDashboard.jsx
    AdminRoute.jsx        picks Login vs Dashboard based on auth state
  App.jsx                 router: "/" public, "/admin" admin
```

## Notes

- Sessions are simple in-memory tokens on the server (kept in a `Map`), valid for
  4 hours of activity, stored client-side in `sessionStorage`. Restarting the
  server invalidates all sessions — that's expected for a small deployment. For
  a real production rollout, swap this for a proper auth solution.
- Original React + Vite template notes are below.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
