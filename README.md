# Front-End Needed Work


## Already done (for reference, do not redo)

- Hosts: list, detail page, add host (form + JSON upload).
- Log sources: list (events + status columns), detail page, add/edit (form + JSON upload).
- Security: hub, Detection hunting console (ES|QL + KQL, mock runner), Alerts queue, alert detail (host + standalone).
- Discover: add/remove field columns, column sort, Field statistics tab (all client-side over mock data).
- Dashboards: clickable detail page with mock panels, Create dashboard modal.
- Machine Learning: model status cards and recent-anomalies preview added under the hero.

--------------------------------------------------------------------------------

## P0 - Authentication and session (foundational, some broken)

- [ ] Fix logout: `component/NavBar.jsx` calls the logout services but never clears the token from `localStorage` or `AuthContext`, so the session persists. Call `useAuth().logout()` and only call `logout-all` when the user explicitly chooses "log out everywhere".
- [ ] Re-enable the route guard: `pages/Authenticator.jsx` has its redirect logic commented out, so every page is public. Redirect unauthenticated users to `/login` and authenticated users away from `/login`.
- [ ] First-run Signup page: call `GET /system/status` (isFirstRun); if true, show a signup screen wired to `POST /auth/signup`. Add the route and a link from Login.
- [ ] 401 handling in `config/axiosInstance.js`: on 401, attempt a refresh via `POST /auth/refresh`, retry once, and on failure clear the session and redirect to `/login`. Currently it only console.logs.
- [ ] Fix the login token bug: `features/Auth/hooks/useLogin.js` sets context from `data.data.token` but the token is at `data.token`.
- [ ] Current user identity: store the analyst (name, email, role) in `AuthContext` after login; show real initials/name in `component/User.jsx` and the NavBar instead of the hardcoded "AB".
- [ ] Role-based UI: hide or disable admin-only actions (create/edit/delete) for non SOC_ADMIN analysts.
- [ ] Wire Forgot / Reset / Verify pages to their hooks (`onSubmit` currently only console.logs). (needs backend for the actual endpoints)
- [ ] Active sessions UI: a screen (likely under Settings) using `GET /auth/sessions` with a "revoke all" action via `POST /auth/logout-all`.

## P1 - Missing pages and dead navigation links

- [ ] Settings page (`/setting`): SideBar links to it but there is no route. Should include profile, change password, active sessions, and a theme toggle.
- [ ] Visualize Library page (`/visualize-library`): SideBar links to it but there is no page. A gallery of saved visualizations (mock first).
- [ ] NotFound (404) route: add a catch-all so unknown paths render a styled page instead of the raw error boundary.
- [ ] Rules / detection-rule management page: the backend has a full Rule CRUD module and Detection's "Save as rule" assumes it, but there is no UI. Build list + create/edit/delete + bulk + duplicate. This is the highest-value missing screen. (wire to existing `/rules`)

## P2 - Backend integration layer (makes the app real instead of mock)

- [ ] Build an API service layer in `services/` for hosts, log sources, alerts, rules, devices, services, dashboards (only `auth.services.js` exists today).
- [ ] Add React Query hooks for each domain (only auth uses React Query now).
- [ ] Replace the in-memory mock stores with API-backed data once endpoints exist. Each mock module exposes a single set of accessors to swap:
  - `utils/hostsMockData.js` (getHostById, addHost) -> `/hosts`
  - `utils/logsMockData.js` (getLogSourceById, addLogSource, updateLogSource) -> `/log-sources`
  - `utils/securityData.js` (getAllAlerts, getSecurityAlertById) -> `/alerts`; (runHuntingQuery, HUNTING_QUERIES) -> `/hunting/*`
  - `utils/dashboardsMockData.js` (getDashboardById, addDashboard, getDashboardPanels) -> `/dashboards`
- [ ] Hosts edit + delete: wire to `PATCH/DELETE /hosts/:id` and add an `updateHost` (only Logs has edit today; the Hosts Pencil is decorative).
- [ ] Persist add/edit actions (hosts, log sources, dashboards) to the backend so they survive a refresh (currently in-memory only).

## P3 - Inert interactions to wire up

- [ ] Global Search bar (`component/SearchBar.jsx` in the NavBar) does nothing. Make it a real global search or remove it.
- [ ] Pagination: lists render all rows. Add pagination controls (the backend already supports page/limit).
- [ ] Tags filter dropdown on Hosts and Log Sources is decorative.
- [ ] Table row checkboxes (Hosts, Log Sources, Dashboards) have no bulk actions.
- [ ] "Add integration" buttons (HomePage, Analytics, SideBar) and HomePage "Try sample data" / "Upload a file" are decorative.
- [ ] Discover: Save / New / Open / Share / Alerts controls, the date-range picker, and "Add a field" are still decorative. Saving a query to localStorage would be a quick client-side win. (full search needs backend)
- [ ] Alert triage buttons (Acknowledge / Close / Escalate) and Host "Isolate" are UI only. (needs backend)

## P4 - Consistency, polish, accessibility

- [ ] Consolidate the two component folders: `component/` (older) and `components/` (newer). Remove the empty stub `component/Card.jsx`.
- [ ] Extract the Hosts add modal into a shared component like `components/LogSourceModal.jsx`, for symmetry.
- [ ] Modal accessibility: Escape-to-close, focus trap, and aria roles for all modals (Add host, Log source, Create dashboard).
- [ ] Loading and skeleton states for when data goes async (the `ui/skeleton.jsx` primitive is unused).
- [ ] Theme toggle: `index.css` defines light-mode tokens but `index.html` hardcodes `.dark`. Either wire a toggle or remove the unused light tokens.
- [ ] Mobile: the NavBar search has a fixed 500px width that can overflow; review small-screen layout (the `use-mobile.js` hook is unused).
- [ ] Remove or use unused assets and `ui/*` primitives to keep the bundle lean (build warns the JS chunk is over 500 kB; consider route-based code splitting).
____
