# Path Lab Web Application Enhancement Plan

To properly organize and execute the various improvements discussed, we should tackle them sequentially. This approach ensures we don't accidentally break the existing functionality of the RS Path Lab while rolling out massive new features.

Below is the proposed roadmap structured into phases.

---

## Phase 1: Dashboard UI & UX Enhancements (We are starting here)
This phase focuses strictly on the front-end layout and user experience, adding polish and visual data elements without disrupting the backend database structure.

**Tasks:**
- [NEW] Install `recharts` for React visual analytics.
- [MODIFY] **`frontend/src/pages/admin/AdminDashboard.jsx`**
  - Add skeleton loading states while `appointments` and `visits` are being fetched over the network.
  - Implement a sleek Confirmation Modal for critical click actions (e.g., clicking "Mark Paid").
  - Add a Visual Analytics section in the `DashboardHome` component showing a breakdown of tests booked and revenue earned (Bar/Line charts).
  - Add an "Export to CSV" button on the Appointments page so you can easily download your appointments.

---

## Phase 2: Feature Engineering (Backend Upgrades)
Once the UI is polished, we will modify the backend routes to handle heavy loads and introduce automated actions.

**Tasks:**
- Implement dynamic Server-Side Pagination in fetching API routes (`/api/admin/appointments`) to dramatically speed up page load times.
- Integrate the backend with Twilio or a similar messaging provider to send automated notifications (SMS/WhatsApp) to patients when they book an appointment and when their report is ready. 
- Implement Role-Based Access Control (RBAC) in the database and JWT tokens, separating accounts into SuperAdmins, Receptionists, and Technicians.

---

## Phase 3: Infrastructure Upgrades
This phase focuses on future-proofing the application by moving off localized database limits.

**Tasks:**
- Implement Amazon S3 or Cloudinary APIs for processing and hosting Pathology PDF reports, replacing any Base64 MongoDB encoding.
- Convert the frontend to a fully installable Progressive Web App (PWA).
- Introduce React Query (TanStack Query) to deprecate manual UI state and standardizing API calls with automatic caching.

---

> [!IMPORTANT]
> **User Review Required**
> Does this phased approach sound practical to you? If so, I am ready to begin implementing **Phase 1** directly, starting by installing charting libraries into your frontend and adding skeleton layouts and modals to your Dashboard!
