# WAITWISE_FULL_PROJECT_AUDIT

> Complete read-only audit of the WaitWise project. This file is the analysis deliverable requested in `check through.txt`.

Date: 2026-10-09

---

## 1. Executive Summary

This audit inspected the repository at C:/Users/MOSES KANYANDI/Desktop/waitwise and the provided patient/staff specification documents. Key findings:

- Technology: A client-side React + Vite app using Firebase (Firestore + Auth) as the backend. See [package.json](C:/Users/MOSES KANYANDI/Desktop/waitwise/package.json).
- Patient UI: Fully implemented end-to-end flows for Screens 1–8 (join, ticket, track, almost-next, called, complete) using client-side Firestore reads/writes and real-time listeners. Relevant code is under [src/pages/patient/] (e.g. [TrackQueuePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/TrackQueuePage.jsx)).
- Staff UI: Only Staff Login is implemented ([src/pages/staff/StaffLoginPage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/staff/StaffLoginPage.jsx)) and staff Auth utility ([src/services/firebase/staffAuth.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/staffAuth.js)). Other staff screens referenced in the spec are not present in routes.
- Admin: Not implemented.
- AI / ML: No generative AI, ML models, or external AI API integrations were found in source files. The waiting-time estimate is a deterministic rule-based calculation in [src/utils/queue.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/utils/queue.js) using a baseline minutes-per-person constant.
- Firestore security rules exist in the repo ([firestore.rules](C:/Users/MOSES KANYANDI/Desktop/waitwise/firestore.rules)) and apply sensible role checks for STAFF and ADMIN.

High-level recommendation: proceed with the requested analysis-only roadmap (capture additional historical timestamps, complete staff UI, and add optional lightweight analytics/prediction later). See Prioritized Recommendations and Roadmap below.

---

## 2. Project Technology Stack

- Frontend: React (v19), Vite, React Router
- Backend-as-service: Firebase (Firestore, Firebase Auth). Client SDK dependency: `firebase` in dependencies. `firebase-admin` appears in devDependencies but there is no server-side code in the repo.
- Language: JavaScript (ES modules)
- Linting: ESLint configured; dev dependencies include `eslint` and `@eslint/js`.

Files confirming the stack: [package.json](C:/Users/MOSES KANYANDI/Desktop/waitwise/package.json)

---

## 3. Folder Structure and File Responsibilities (high level)

- [src/] (application source)
  - [components/] common, layout, patient (UI building blocks)
  - [pages/patient/] patient screens (Home, Join, Confirm, Ticket, Track, AlmostNext, Called, Complete)
  - [pages/staff/] StaffLoginPage.jsx (login implemented)
  - [services/] Firestore & queue service logic: [src/services/queueService.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/queueService.js)
  - [services/firebase/] firebase config and wrappers ([config.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/config.js), [firestore.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/firestore.js), [staffAuth.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/staffAuth.js))
  - [utils/] queue calculation helpers ([src/utils/queue.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/utils/queue.js))
  - [constants/] documented initial service catalog and queue constants ([queueConstants.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/constants/queueConstants.js))

Other top-level items of interest:
- [firestore.rules] (security rules)
- [design-reference/] (UI screenshots used as source of truth)
- docs/specs: [WaitWise_Patient_Website_Agent_Spec.md](C:/Users/MOSES KANYANDI/Desktop/waitwise/WaitWise_Patient_Website_Agent_Spec.md) and [WaitWise_Staff_Website_Agent_Spec.md](C:/Users/MOSES KANYANDI/Desktop/waitwise/WaitWise_Staff_Website_Agent_Spec.md)

(Full file list inspected during the audit is available on request.)

---

## 4. Architecture and Data Flow (summary)

- The app is a single-page React app. Routing is defined in [src/App.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/App.jsx).
- Firestore is the single source of truth for queues. The client uses Firestore queries, `runTransaction` (for ticket counters), `onSnapshot` listeners, and `updateDoc` operations in [src/services/queueService.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/queueService.js).
- Timestamps are written using `serverTimestamp()` when creating/updating entries; client code reads these fields and converts them via utilities in [src/utils/queue.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/utils/queue.js).
- There is a defensive in-memory queue fallback store (`memoryQueueStore`) for offline resilience; it is purely client-side and not written to Firestore except when a transaction succeeds.

Data flow examples:
- Create ticket: `createQueueEntry()` in queueService -> Firestore transaction on `counters/{id}` and `queueEntries` documents (writes `enteredAt`, `createdAt` using serverTimestamp).
- Live updates: `subscribeToServiceQueue()` and `subscribeToQueueEntry()` attach Firestore listeners and also listen to memory store.
- Queue position calculation: `calculateQueuePosition(entries, entryId)` uses FIFO ordering based on `enteredAt`/`createdAt` and returns position and estimated wait using a baseline constant.

---

## 5. Patient-Side Implementation Audit (confirmed)

Files of interest:
- Pages: [src/pages/patient/HomePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/HomePage.jsx), [JoinQueuePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/JoinQueuePage.jsx), [ConfirmQueuePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/ConfirmQueuePage.jsx), [TicketPage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/TicketPage.jsx), [TrackQueuePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/TrackQueuePage.jsx), [AlmostNextPage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/AlmostNextPage.jsx), [CalledPage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/CalledPage.jsx), [CompletePage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/patient/CompletePage.jsx).
- Queue service: [src/services/queueService.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/queueService.js)
- UI components: ticket card, quick info, progress dots under [src/components/patient/]
- Demo preview states in [src/constants/devDemoState.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/constants/devDemoState.js)

Confirmed behavior:
- Services are fetched from `services` collection via `getServices()` and fallback to an initial catalog when necessary.
- Creating a queue entry uses a transaction on a `counters/{id}` doc to generate sequential ticket numbers and writes `enteredAt` and `createdAt` server timestamps.
- Track page subscribes to both the patient's entry document and the waiting queue for the service and recalculates position with `calculateQueuePosition()`.
- Position calculation uses `enteredAt`/`createdAt` ordering and returns human-friendly ranges using a simple baseline rule (see Section 10 — Waiting-Time Prediction).

Potential gaps / minor issues found in patient-side code (evidence-based):
- The code depends on Firestore server timestamps but also falls back to client-generated ISO strings in memory store; this is acceptable for offline fallback but should be kept distinct when building analytics.
- The demo states use hard-coded values for previews — confirm dev preview routes are never used in production (they are guarded by `import.meta.env.DEV`).

---

## 6. Staff-Side Implementation Audit

Confirmed code:
- Staff login UI and flow: [src/pages/staff/StaffLoginPage.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/pages/staff/StaffLoginPage.jsx)
- Staff auth helpers: [src/services/firebase/staffAuth.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/staffAuth.js)
- Firestore-backed `users/{uid}` profile check (role == "STAFF" and active == true)

What is missing (confirmed):
- Staff routes for Dashboard, Queue Management, History, Consultation, Settings are not present in [src/App.jsx]. Only /staff/login exists.
- Staff-specific components and pages are not present under `src/pages/staff/` besides StaffLoginPage.jsx and no `src/components/staff/` UI is present in routes.

Recommendations (staff-side):
- Implement staff pages in the order: Queue Management (most critical), Current Consultation, Dashboard, History, Settings. Integrate each page incrementally with `queueService` methods and Firestore listeners.
- Reuse `subscribeToServiceQueue()` and `updateQueueEntryStatus()` for calling next patient and updating statuses.

---

## 7. Admin-Side Current State and Recommendations

Current state: Not implemented. There are no admin pages or components.

Recommended admin architecture (high level):
- Admin UI (protected by role == ADMIN) for facility/service management, staff account management, and audit log review.
- Reuse existing Firestore collections (`facilities`, `services`, `users`, `auditLogs`) and enforce admin-only write access via Firestore rules (already present in `firestore.rules`).

Suggested first admin features:
1. Service and facility management (create/update services).  
2. Staff account listing and assignment to facility/service.  
3. Audit logs viewer.  
(Implement with minimal read/write forms and server-side validation where possible.)

---

## 8. Markdown Documentation Review

Files inspected:
- [WaitWise_Patient_Website_Agent_Spec.md](C:/Users/MOSES KANYANDI/Desktop/waitwise/WaitWise_Patient_Website_Agent_Spec.md)
- [WaitWise_Staff_Website_Agent_Spec.md](C:/Users/MOSES KANYANDI/Desktop/waitwise/WaitWise_Staff_Website_Agent_Spec.md)

Summary of alignment:
- Patient spec and implementation: Largely aligned. The patient pages and UI components follow the screens and behaviors described in the patient spec; key functions like `getServices()`, ticket creation, and tracking are implemented.
- Staff spec vs code: Only the login portion of the staff spec is implemented. The detailed staff screens and workflows described in the staff spec are not yet present.

Documentation discrepancies / missing items:
- The staff spec documents many collection fields (e.g. `predictions/{predictionId}`) that are not currently written/managed by code — this is a planned schema rather than an implemented feature.

---

## 9. AI Integration Audit (detailed)

Search scope: entire `src/` directory and project root.

Findings (evidence-based):
- No code calling external AI APIs (OpenAI, Google Vertex, Firebase AI, or other third-party generative/ML SDKs) was found in `src/`.
- No server-side functions or Cloud Functions are present in the repo (no `functions/` folder, no server code). `firebase-admin` exists in devDependencies but not used in the repository code.
- The repository includes a spec description for a `predictions` collection in the staff spec, but there is no code producing prediction documents.

Conclusion: There are currently no active ML/AI integrations. Any future AI integration would be a net-new addition and must be treated as such (credentials, data governance, consent, and privacy).

---

## 10. Waiting-Time Prediction and Historical Data Readiness

Current implementation:
- Waiting-time estimates are computed in [src/utils/queue.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/utils/queue.js) by `calculateQueuePosition()` using a baseline minutes-per-person constant (`BASELINE_MINUTES_PER_PERSON` in [src/constants/queueConstants.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/constants/queueConstants.js)). This is a deterministic rule-based approach.

What is recorded now (evidence):
- `createQueueEntry()` writes `enteredAt` (serverTimestamp) and `createdAt` to `queueEntries`.
- `updateQueueEntryStatus()` sets `updatedAt` (serverTimestamp) and allows staff to set new statuses. Code paths for setting `calledAt`, `consultationStartedAt`, or `completedAt` exist in the data model described in staff spec and in Firestore rules, but the client code does not explicitly set `calledAt`/`consultationStartedAt`/`completedAt` timestamps (it updates `status` and `updatedAt`).
- Demo state and spec mention these fields; Firestore security rules permit staff updates to statuses.

What additional data is required for a reliable predictor:
- Explicit timestamps for lifecycle transitions per entry: `calledAt`, `consultationStartedAt`, `completedAt` (server-side timestamps preferred).
- Service-type and facility identifiers per entry (already present).
- Staff or room identifiers (optional but useful for per-staff/per-room analytics).
- Persistent historical records (completed entries with accurate timestamps and actualWaitMinutes).

Recommended incremental approach (student project):
1. Ensure each staff action that changes a queue entry to CALLED, IN_CONSULTATION, COMPLETED writes serverTimestamp fields (`calledAt`, `consultationStartedAt`, `completedAt`) in addition to `status` (minimal, surgical change in queueService update API).
2. Create an offline ETL-style aggregator (a scheduled function or a simple client-side export) that computes per-service statistics (average service time, recent window averages) and stores summary docs in `predictions` or `analytics` collection.
3. Use a simple statistical model (moving average, exponential smoothing) to compute `estimatedWaitMinutes` initially — no ML required. This approach is transparent, easy to verify, and appropriate for a student project.
4. Only after collecting > several hundred completed entries with clean timestamps consider a lightweight ML model (e.g., regression) and host it in a serverless function or external service.

Privacy & safety notes:
- Do not let any prediction algorithm override triage or emergency prioritization. Predictions must be advisory only.
- Ensure data minimization and retention rules match privacy requirements; do not store unnecessary personal identifiers.

---

## 11. Firebase and Database Review

Files inspected: [src/services/firebase/config.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/config.js), [firestore.rules](C:/Users/MOSES KANYANDI/Desktop/waitwise/firestore.rules)

Findings:
- The repo contains a client Firebase config file with keys. (Client config values in `src/services/firebase/config.js` are part of the app but treat secrets carefully — do not publish private admin credentials.)
- Firestore rules exist and enforce role checks (isStaff/isAdmin), restrict writes on `queueEntries` and `counters`, and limit reads appropriately. The rules are a good baseline.
- There is no server-side enforcement beyond Firestore rules. Any sensitive admin workflows must rely on these rules or add server-side checks if necessary.

Items to verify during implementation:
- Confirm that Firestore rules are deployed and match the repo's `firestore.rules` file.
- Confirm that `createQueueEntry()` transaction and `counters` update patterns are safe from concurrency issues (the code uses Firestore transaction — appropriate).

---

## 12. Security, Reliability, and Data-Handling Findings

Confirmed positives:
- Firestore security rules check role and `active` flag for staff actions.
- Ticket generation uses transactions to avoid duplicate ticket numbers in normal operation.
- Real-time listeners are used appropriately; memory fallback exists for offline scenarios.

Potential risks / items to review (evidence-based):
1. Client-side firebase config values are in repo. These are client SDK keys (not a private secret in typical Firebase setups), but confirm no admin/service-account keys were committed. (Action: review `src/services/firebase/config.js` and remove any server admin credentials.)
2. The client frequently reads and lists queueEntries — consider rules and read costs for large queues; paginate / limit queries where appropriate.
3. Staff update rules allow updates to queue `status` if `isStaff()`; the rules do not require additional checks per-status transition (for example, preventing a staff member from flipping status from COMPLETED back to WAITING). Consider stricter rules or server-side validation if misuse is a concern.
4. The code sometimes falls back to client-generated timestamps in memory store — ensure these are not used in analytics as authoritative.

---

## 13. Bugs, Gaps, and Technical Debt (evidence-based)

- Missing staff screens beyond login (confirmed in [src/App.jsx](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/App.jsx)).
- No code writing `calledAt`, `consultationStartedAt`, or `completedAt` in queueService (the data model expects these fields; they should be written by staff actions to enable analytics).
- `predictions` collection described in spec is not produced by any code.

---

## 14. Prioritized Recommendations

Priority 1 — Essential
1. Instrument lifecycle timestamps: ensure staff actions that change status to `CALLED`, `IN_CONSULTATION`, and `COMPLETED` write server timestamps (`calledAt`, `consultationStartedAt`, `completedAt`) in the same transaction/update as the `status` change. (Files: [src/services/queueService.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/queueService.js), staff pages.)
2. Implement staff Queue Management page and connect it to `subscribeToServiceQueue()` and `updateQueueEntryStatus()` so real actions update Firestore. (Files: create under [src/pages/staff/], [src/components/staff/]).
3. Verify Firestore rules are deployed and cover the expected per-status restrictions; add stricter checks for illegal transitions if needed. (File: [firestore.rules](C:/Users/MOSES KANYANDI/Desktop/waitwise/firestore.rules)).

Priority 2 — Important
1. Add server-side (or scheduled) aggregation to compute rolling averages or store prediction documents in `predictions/` using completed entries. This can be a Cloud Function or a simple manual job.
2. Implement admin pages for service/facility/staff management.

Priority 3 — Advanced
1. If data volume and quality justify it, evaluate a small ML model to predict service durations; host as a function and produce `predictions` documents. Start with simple regression or time-window averages.
2. Add robust analytics dashboards (admin) using the aggregated statistics.

---

## 15. Proposed Development Roadmap (practical sequence)

1. Add timestamp instrumentation for staff actions (short change in `queueService` and staff UI).  (Goal: collect the data needed for analytics.)
2. Implement Staff Queue Management page and basic call/complete actions; connect to Firestore. (Goal: allow staff to operate queues.)
3. Deploy/verify Firestore rules.  (Goal: secure operations.)
4. Create an aggregation job to compute per-service recent averages and populate `predictions/`. (Goal: better estimates.)
5. Implement Admin UI to manage services, staff, and view analytics. (Goal: operational control.)
6. Consider a predictive model after collecting sufficient high-quality historical data. (Goal: improved accuracy.)

Each stage should include tests and acceptance criteria. See Testing Recommendations below.

---

## 16. Testing Recommendations

- Unit test `calculateQueuePosition()` across edge cases (empty queue, newly created entries, identical timestamps).
- Integration test the create-ticket transaction under simulated concurrency (if possible) to verify counters behave.
- E2E tests for patient Join→Ticket→Track flow and staff Call→Complete flow (once staff UI exists).
- Security tests: attempt disallowed updates to `queueEntries` and confirm Firestore rules block them.

---

## 17. Important Files to Inspect Next

- [src/services/queueService.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/queueService.js) — implement timestamp writes on status changes
- [src/pages/staff/] (absent beyond login) — implement staff UI pages
- [firestore.rules](C:/Users/MOSES KANYANDI/Desktop/waitwise/firestore.rules) — confirm deployment and consider stricter transition checks
- [src/services/firebase/config.js](C:/Users/MOSES KANYANDI/Desktop/waitwise/src/services/firebase/config.js) — validate no admin secrets are committed
- [WaitWise_Staff_Website_Agent_Spec.md](C:/Users/MOSES KANYANDI/Desktop/waitwise/WaitWise_Staff_Website_Agent_Spec.md) — plan staff work against this spec

---

## 18. Questions and Unknowns (need your input)

1. Should staff actions explicitly set `calledAt`, `consultationStartedAt`, and `completedAt` now (I recommend yes)?
2. Do you intend to run server-side (Cloud Functions) code or keep everything client-only and rely solely on Firestore rules/transactions?
3. Is the `predictions` collection intended to be produced by client code, or by a server-side job / scheduled function?

---

If you want, I can now:
- Implement a minimal, surgical change to `updateQueueEntryStatus()` to include server timestamps for `calledAt`/`consultationStartedAt`/`completedAt` on the appropriate status updates (requires your explicit authorization), OR
- Continue and produce a more detailed per-file audit (longer report) that includes code snippets and exact line references for every finding.


---

_This audit was performed as a read-only analysis of the repository. No files were modified except the creation of this requested audit report._
