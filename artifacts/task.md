- [x] Install `recharts` for React visual analytics.
- [x] Add skeleton loading states in `AdminDashboard.jsx`.
- [x] Implement a Confirmation Modal for critical click actions in `AdminDashboard.jsx`.
- [x] Add a Visual Analytics section in the `DashboardHome` component using `recharts`.
- [x] Add an "Export to CSV" button on the Appointments page.

## Phase 2
- [x] Add server-side pagination to `/api/admin/appointments` (page, limit, search, filter query params).
- [x] Add `/api/admin/stats` endpoint for dashboard charts (works independently of pagination).
- [x] Add `/api/admin/staff-login` endpoint for RBAC staff accounts.
- [x] Add Cancel Appointment button with confirmation modal on the frontend.
- [x] Add "Notify Patient" WhatsApp deep-link button on each appointment row.
- [x] Implement role-based sidebar and action visibility (superadmin / receptionist / technician).
- [x] Update `AdminLogin.jsx` to use new staff-login API and persist role/name in localStorage.
- [x] Add paginated `Pagination` component with page number controls to Appointments page.

## Phase 3
- [x] Install `vite-plugin-pwa` and configure PWA manifest with icons, theme color, and workbox caching.
- [x] Generate custom RS Path Lab PWA icon and place it in `public/icons/`.
- [x] Update `index.html` with full PWA meta tags (theme-color, apple-touch-icon, apple-mobile-web-app-capable).
- [x] Build `PWAInstallPrompt.jsx` component — native install dialog on Android, manual iOS instructions.
- [x] Wire `PWAInstallPrompt` into `App.jsx` so it appears globally.
- [x] Install `@tanstack/react-query` and wrap app with `QueryClientProvider` in `main.jsx`.
- [x] Install `cloudinary` on the backend.
- [x] Create `backend/config/cloudinary.js` SDK config module.
- [x] Upgrade `upload-report` route to use Cloudinary when credentials set, Base64 MongoDB as fallback.
- [x] Add Cloudinary and STAFF_ACCOUNTS placeholder vars to `backend/.env` with instructions.
