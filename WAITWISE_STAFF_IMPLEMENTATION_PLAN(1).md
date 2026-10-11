# WaitWise Staff Implementation Plan

**Prepared:** 2026-10-09  
**Scope:** Planning only. No application code, Firebase configuration, rules, dependencies, or data were changed to prepare this document.

## Evidence labels

- **Confirmed** — directly present in the repository snapshot inspected for this plan.
- **Recommendation** — proposed future design, not implemented.
- **Potential risk** — the current design permits an undesirable outcome; live exposure may depend on deployment/data.
- **Unverified** — cannot be established from repository evidence alone.

Line numbers refer to the current repository snapshot. Requirements from older specifications are not treated as proof of implementation.

## 1. Executive Summary

The project is a React/Vite client with Firebase Auth and Firestore. The patient-facing queue flow and shared queue service already exist. The Staff area currently has a login page and authentication helpers only; there are no operational staff pages, staff route protection, or Admin pages. The queue service can create tickets with a Firestore transaction and can subscribe to an individual entry or the waiting queue, but its current status-update API does not validate transitions, record lifecycle event timestamps, or reliably propagate Firestore write failures.

This plan follows the newly specified **four main authenticated Staff screens**:

1. Staff Dashboard
2. Queue Management (consultation actions inline; no separate Current Consultation screen)
3. Queue History
4. Staff Profile and Settings

`/staff/login` remains a separate authentication entry/gate and is not counted as one of these four operational screens. The older Staff specification describes Dashboard, Queue Management, Current Consultation, History, and Settings as distinct screens/routes (see `WaitWise_Staff_Website_Agent_Spec.md:301-331, 752-772, 820-832`). The newer four-screen requirement supersedes that separation: consultation becomes an inline panel/action flow within Queue Management.

**Owner decisions recorded on 2026-10-09:** each Staff account is assigned to exactly one facility and exactly one service; multiple patients may be active at once up to that service’s configured capacity; cancellation of waiting tickets and marking called tickets as no-show are included in the first release; Staff may edit only approved personal profile details while role, active status, facility, and service assignment remain read-only. The testing environment is deliberately undecided until the current Firebase setup is reviewed. The implementation must enforce these choices in trusted data operations and Firestore rules, not only in the UI. The patient side must remain compatible: staff status changes must continue to update the same Firestore queue document so the patient’s existing listeners can observe them.

## 2. Verified Current Architecture

### Application and routing

- `package.json` declares React 19, React DOM, React Router, Firebase, and Vite; it provides `dev`, `build`, `lint`, and `preview` scripts but no test script.
- `src/App.jsx:1-17` imports eight patient pages, `StaffLoginPage`, and development preview data. `src/App.jsx:23-47` registers `/staff/login` and patient routes. There is no authenticated Staff route/layout and no Admin route. Development previews at `/dev/screen-4` through `/dev/screen-8` are conditionally registered under `import.meta.env.DEV` (`src/App.jsx:49-73`).
- `src/main.jsx` and `src/index.css` are the app bootstrap/global style entry points.

### Firebase and data access

- `src/services/firebase/config.js` initializes one Firebase app; `src/services/firebase/auth.js` and `firestore.js` export the Auth and Firestore clients.
- `firebase.json` configures Firestore with `firestore.rules` and `firestore.indexes.json`. It has no `emulators` configuration block.
- `src/services/queueService.js` contains Firestore access, ticket allocation, a module-local volatile queue fallback, and real-time subscriptions.
- `src/utils/queue.js` owns pure position/estimate helpers; `src/constants/queueConstants.js` defines statuses, a seven-minute baseline and a fallback service catalog.
- Firebase access currently occurs from the browser client. `firebase-admin` is listed as a dev dependency, but no backend/Cloud Functions source or server-side authorization handler was found in the inspected project structure.

### Current queue data and status values

`QUEUE_STATUS` in `src/constants/queueConstants.js:7-14` contains:

```text
WAITING
CALLED
IN_CONSULTATION
COMPLETED
CANCELLED
NO_SHOW
```

The patient spec documents the primary sequence `WAITING → CALLED → IN_CONSULTATION → COMPLETED` and the optional terminal paths `WAITING → CANCELLED` and `CALLED → NO_SHOW` (`WaitWise_Patient_Website_Agent_Spec.md:611-621`). The staff spec documents the same lifecycle (`WaitWise_Staff_Website_Agent_Spec.md:267-280`). Do not add status names for this plan.

## 3. Current Staff Implementation Status

### Implemented

- `src/pages/staff/StaffLoginPage.jsx` provides email/password login, session checking, password reset, sign-out, password visibility, and UI feedback (`:50-168, 184-267`).
- `src/services/firebase/staffAuth.js` provides `subscribeToAuthState()`, `getActiveStaffProfile()`, `signInStaff()`, password reset, and sign-out (`:11-49`).
- `getActiveStaffProfile(uid)` requires a `users/{uid}` document with `role === "STAFF"` and `active === true` (`staffAuth.js:15-23`).
- `firestore.rules` separately checks signed-in role/active status for Staff-authorized operations (`:6-28`).

### Not implemented

- No dashboard, queue-management, queue-history, or staff profile/settings page.
- No Staff shell/sidebar or Staff route guards.
- No verified facility/service assignment enforcement in the login profile helper or Firestore rules.
- No production Staff workflow invoking queue status changes.
- No validated status-transition API, lifecycle timestamp writes, or staff-authored audit log flow.
- No Admin UI or functions. The Admin role appears in rules/specification only; this plan does not add an Admin screen.

An authenticated user currently remains on `/staff/login` and sees a signed-in state with a sign-out action (`StaffLoginPage.jsx:185-196`). Successful sign-in does not navigate into Staff operations because those routes do not yet exist.

## 4. Relevant File and Folder Inventory

| File/folder | Current responsibility and relevance |
|---|---|
| `src/App.jsx` | Patient routes, `/staff/login`, development patient previews; future protected Staff routes and route-level access handling belong here or in a routing module if one is intentionally introduced. |
| `src/pages/staff/StaffLoginPage.jsx` | Existing login, session, reset, and sign-out UX. |
| `src/services/firebase/staffAuth.js` | Firebase Auth and Staff profile checks; likely needs assignment loading and consistent profile errors. |
| `src/services/firebase/auth.js` | Firebase Auth instance. |
| `src/services/firebase/config.js` | Single Firebase app initialization; keep rather than introducing a second one. |
| `src/services/firebase/firestore.js` | Firestore client initialization. |
| `src/services/queueService.js` | Service/facility reads, queue read, transaction ticket creation, status update, entry/service subscriptions. |
| `src/utils/queue.js` | FIFO position and fixed-baseline estimate. Can be reused for staff queue ordering, with careful handling for incomplete timestamps. |
| `src/constants/queueConstants.js` | Existing status enum, facility ID, baseline constant and fallback service definitions. |
| `src/pages/patient/ConfirmQueuePage.jsx` | Calls `createQueueEntry()` and navigates to a ticket on a resolved result (`:90-113`). |
| `src/pages/patient/TrackQueuePage.jsx` | Reads/subscribes to a patient entry and waiting service queue; navigates on called/completed status (`:54-124`). |
| `src/pages/patient/CalledPage.jsx` | Subscribes to the entry and navigates to Complete on completion (`:42-60`). |
| `src/pages/patient/CompletePage.jsx` | Displays completion detail; formats date using `completedAt || updatedAt || createdAt` (`:49-53`). |
| `src/utils/storage.js` | Browser-local active-ticket recovery convenience; documented as not the source of truth. |
| `src/components/common/Icons.jsx`, `src/components/layout/` | Existing reusable patient/common UI. Reuse only if it fits Staff UX; do not couple staff workflows to patient-specific components. |
| `src/styles/patient.css`, `src/styles/staff-login.css`, `src/index.css` | Existing style boundaries. New Staff styling should remain separate from patient styles. |
| `firestore.rules` | Local Firestore rules file. Its deployed state is unverified. |
| `firestore.indexes.json` | Currently contains no declared composite indexes (`indexes: []`). Needed indexes should be added only after final Staff queries are known and validated. |
| `firebase.json` | References local rules/indexes; no emulator endpoints are configured in this file. |
| `WaitWise_Patient_Website_Agent_Spec.md` | Patient flow, status, ticket persistence, real-time, and connectivity requirements. |
| `WaitWise_Staff_Website_Agent_Spec.md` | Existing staff design/source requirements; its six-screen decomposition conflicts with the newer four-screen rule. |
| `docs/decisions-log.md` | Records Staff Login Stage 1A decisions and says live Auth/rules behavior was not verified. |
| `scratch/verify_queue_data.mjs` | Standalone deterministic sample exercising `calculateQueuePosition()` with `console.assert`; not a formal test-runner test. |
| `scratch/test_service_queue.mjs` | Calls Firestore queue read/create/status update functions; it can affect the configured Firebase project and should not be run casually. |
| `scratch/test_screens_6_to_8.mjs` | Explicitly describes a live Firestore lifecycle scenario, requires staff credentials, creates entries/updates statuses. Not an isolated emulator test; do not run without deliberate test-project setup and cleanup. |

No files matching conventional `*.test.*` / `*.spec.*` test naming were found under the repository. No test framework is declared in `package.json`.

## 5. Four-Screen Staff Architecture

### Screen boundary

The four main authenticated screens are exactly:

| Screen | Proposed route |
|---|---|
| Staff Dashboard | `/staff/dashboard` |
| Queue Management | `/staff/queue` |
| Queue History | `/staff/history` |
| Staff Profile and Settings | `/staff/profile` |

Keep `/staff/login` as the existing unauthenticated entry/authentication gate. That login page is not a fifth main authenticated screen. Do not register `/staff/consultation` or a separate patient-details route. Current Consultation is an inline selected-ticket panel/section on `/staff/queue`.

### Shared shell and data boundary

**Recommendation:** add a small Staff layout/shell that provides the four navigation destinations, current facility/service context, identity/profile menu, and sign-out. Route guards should wait for Auth state and a validated Staff profile before rendering protected screens; unauthenticated users go to `/staff/login`, while authenticated but inactive/misconfigured users see a clear denied/unavailable state and cannot query or mutate queue data.

Do not rely on hiding links or filtering arrays in React. Each queue query and mutation must be constrained by Firestore rules (or a trusted backend if client-side rules cannot safely express the required operation). The client must derive its permitted facility/service context from the authenticated profile, not arbitrary route state or URL parameters.

### Proposed component/service shape

Keep the current application style and avoid a state-management framework:

```text
src/
  components/staff/
    StaffLayout.jsx
    StaffSidebar.jsx              # optional if sidebar warrants a separate component
    QueueEntryRow.jsx
    QueueStatusBadge.jsx
    ActiveConsultationPanel.jsx   # inline panel, not a screen/route
    StaffFeedback.jsx             # only if a shared pattern is needed
  pages/staff/
    StaffLoginPage.jsx            # existing
    StaffDashboardPage.jsx
    StaffQueuePage.jsx
    StaffHistoryPage.jsx
    StaffProfilePage.jsx
  services/
    queueService.js               # strengthen shared queue API
    firebase/staffAuth.js         # profile/assignment validation
  styles/
    staff.css
```

These are candidate files, not a requirement to create every small component. Keep Firestore logic in services; use a small hook only if subscription lifecycle is reused across pages.

## 6. Functional Requirements by Screen

### Screen 1 — Staff Dashboard

**Purpose:** quick, service/facility-scoped operational snapshot, not an administrative dashboard.

Recommended content:

- Current authenticated staff facility and authorized service context.
- Counts for WAITING, CALLED, IN_CONSULTATION, and COMPLETED for a clearly stated time window.
- Most urgent next eligible waiting ticket and active ticket(s), if authorized; quick links to Queue Management and Queue History.
- Transparent estimated wait only if shown as an approximate queue estimate and derived from current authorized data.

Data handling:

- Reuse a service-scoped live queue view for active statuses; `subscribeToServiceQueue()` currently returns only `WAITING` entries (`queueService.js:341-396`) and is not enough for called/in-consultation metrics.
- Avoid downloading unbounded historical entries just to show “completed today.” Use a date-bounded, paginated query or a trusted aggregate if the dashboard requires that count. Determine facility timezone/day boundary before defining “today.”
- Show loading, empty, permission-denied, and connection/read-error states separately. A missing assignment must not be converted into a default facility/service.
- Do not show names, diagnoses, or patient accounts; use ticket code and operational status only, in keeping with the Staff specification (`WaitWise_Staff_Website_Agent_Spec.md:217-237, 319-345`).

### Screen 2 — Queue Management (includes current consultation)

**Purpose:** single operational screen for active waiting tickets and consultation actions.

Recommended layout/interaction:

- Real-time active queue grouped into Waiting and Active (Called / In Consultation) sections, ordered FIFO using `enteredAt`, with ticket code, status, relevant event times, and service/facility context.
- Only the earliest eligible waiting ticket receives an enabled Call action; other rows do not enable Call. Eligibility also depends on the open capacity policy (see Section 15), not just a client-side sort.
- Selecting a called/in-consultation ticket opens `ActiveConsultationPanel` inline or as a non-route modal/drawer. It shows only authorized operational fields: ticket code, current status, service/facility, room if actually assigned, `calledAt`, consultation start time, and permitted actions.
- Show Start Consultation for a valid `CALLED` ticket, then Complete for a valid `IN_CONSULTATION` ticket. Confirmation may be appropriate for irreversible actions; actions need pending/success/failure feedback and must be disabled while that request is pending.
- Include Cancel for `WAITING` and Mark No-show for `CALLED` only after product approval of the corresponding staff interaction and timestamp/audit behavior. Both states exist in `QUEUE_STATUS` and the written lifecycle specs, but the current application has no Staff action or outcome timestamp for them.
- Do not add a separate Consultation screen, patient name, clinical notes, diagnoses, prescriptions, or other medical-record fields.

Concurrency and action correctness:

- The UI's visible queue is advisory; the Firestore transaction/rules must decide whether a transition is accepted.
- If two staff clients select the same next entry, one valid transition should commit; the other must receive an explicit stale/duplicate-action response and refresh its live view, not report success or silently act on the next ticket.
- If policy allows multiple active patients, model capacity explicitly. If capacity is one, preventing a second call while an active ticket exists must be enforced atomically, not solely in the UI.

### Screen 3 — Queue History

**Purpose:** operational review of completed and other approved terminal queue activity for the caller's authorized facility/services.

Recommended fields:

- Ticket code, service, terminal status, and only event times actually stored.
- For completed items: `enteredAt`, `calledAt`, `consultationStartedAt`, `completedAt`; calculated durations only when source timestamps are valid and present.
- Include `CANCELLED` and `NO_SHOW` filters in the first release. New accepted transitions should write `cancelledAt` and `noShowAt` server timestamps respectively. Legacy records without these fields must show the event time as unknown rather than treating `updatedAt` as the cancellation/no-show time or inventing completion duration.

Filters and scale:

- Date range and status filters (Completed, No-show, Cancelled) are suitable; an exact ticket-code search may be supported.
- Firestore does not provide general substring/full-text search. Do not claim full-text search by filtering only the loaded page. If broader search is required, choose an appropriate indexed/backend approach.
- Use stable ordering and cursor pagination (`limit`/`startAfter`); never load all historical queue entries. Choose a timestamp for ordering separately by outcome, or define a consistent event-time model first.
- The current `firestore.indexes.json` declares no composites. Derive required indexes from actual queries, test them, then add only the indexes needed.
- Errors and missing timestamps should be explicit. Empty history is distinct from a failed read.

### Screen 4 — Staff Profile and Settings

Approved profile policy: allow limited personal-detail editing, with role, active status, facility, and service assignment permanently read-only to the Staff user. The exact editable personal fields still need to be checked against the existing schema and confirmed before implementation; do not invent new fields or expose security/access fields for editing.

Recommended content/actions:

- Display Auth email and validated profile `name`/display label, role, active status, facility, and service assignment(s).
- Keep role, `active`, facility, and the single service assignment read-only. Only explicitly approved personal-detail fields may be editable; exact field names remain to be confirmed from the current schema.
- Existing profile schema uses `name`, while the proposed schema mentions `displayName`; prefer retaining one canonical name field unless a deliberate migration/schema choice is approved.
- Any editable preferences should be local or narrowly defined; do not add unsupported notification/system/database settings.
- Sign out via existing `signOutStaff()` and show an error if sign-out fails.

## 7. Detailed Component and File Responsibilities

| Candidate file | Responsibility |
|---|---|
| `src/pages/staff/StaffDashboardPage.jsx` | Service-scoped dashboard presentation and loading/empty/error states; no raw Firestore calls. |
| `src/pages/staff/StaffQueuePage.jsx` | Active queue orchestration and inline consultation panel state; call service APIs and render action outcomes. |
| `src/pages/staff/StaffHistoryPage.jsx` | Scoped filters, pagination, historical event rendering, and missing-data presentation. |
| `src/pages/staff/StaffProfilePage.jsx` | Read-only identity/assignment display, only-approved editable preferences, sign-out. |
| `src/components/staff/StaffLayout.jsx` | Four-screen navigation shell, shared facility/service context, responsive layout. |
| `src/components/staff/QueueEntryRow.jsx` | Queue item display and eligibility/action affordances. |
| `src/components/staff/ActiveConsultationPanel.jsx` | Inline current called/in-consultation detail/actions inside Queue Management; not a separate screen. |
| `src/services/queueService.js` | Explicit-error query/subscription APIs and atomic, validated, idempotent transitions. Keep patient API behavior compatible. |
| `src/services/firebase/staffAuth.js` | Validate role, active state, and assignment shape; provide clear unauthorized/misconfigured outcomes. |
| `firestore.rules` | Enforce authenticated role, active status, facility/service scope, field constraints, and lifecycle transition constraints. |
| `firestore.indexes.json` | Add only indexes proven necessary for scoped history/dashboard query shapes. |
| `src/constants/queueConstants.js` | Reuse existing status values; optionally define transition metadata only if shared logic genuinely needs it. Do not add new statuses. |
| `src/utils/queue.js` | Reuse FIFO/time helpers; fix or test missing-timestamp ordering before relying on it operationally. |
| `src/App.jsx` | Register login gate and four protected main routes; retain existing patient routes and previews. |
| `src/styles/staff.css` | Staff UI styles isolated from patient styles. |
| `docs/decisions-log.md` | Record implementation decisions as requested by the existing Staff spec; do not present untested items as tested. |

## 8. Authentication and Authorization Design

### Current behavior

- Firebase email/password sign-in is implemented by `signInStaff()` (`src/services/firebase/staffAuth.js:25-40`); the login page has no public account-creation action.
- The page subscribes to Auth state and reloads the profile (`StaffLoginPage.jsx:79-118`).
- A missing/non-Staff/inactive profile yields denial and is signed out. A Firestore/profile read failure is also signed out by the page and shown as a generic verification error.
- Firebase Auth's default web persistence is retained according to `docs/decisions-log.md`; this was not independently runtime-tested during this planning task.

### Recommended staff profile shape

Use the existing `users/{uid}` document as the profile and preserve known fields. Recommended shape, subject to approval:

```text
document ID: Firebase Auth uid
role: "STAFF"
active: boolean
facilityId: string
serviceIds: string[]       # one or more authorized services at this facility
name: string               # existing schema; avoid duplicate displayName without reason
email: string
createdAt: server timestamp
updatedAt: server timestamp
```

The Staff spec currently documents only `facilityId`, not `serviceIds` (`WaitWise_Staff_Website_Agent_Spec.md:498-520`). Adding `serviceIds` is therefore a proposed schema change, not an existing field. If future requirements allow staff across multiple facilities, one `facilityId` plus `serviceIds` will not suffice; define an explicit assignments structure rather than infer it.

### Enforcement and failure behavior

1. Load the profile using the signed-in Auth UID. Missing profile, wrong role, inactive account, malformed/missing facility, empty service assignment, or references to unknown/inactive services must prevent access to all four main routes and queue APIs.
2. Derive permitted facility/service filters from that verified profile. Do not let a URL, component state, or local storage expand them.
3. On login/profile verification error, fail closed and show a retry/support message. Do not treat a read failure as an unassigned but usable account.
4. Protect every queue read/write in `firestore.rules` (or a trusted backend) with role, active status, facility, and service checks. UI route guards are defense-in-depth, not authorization.
5. Re-check current authorization through every protected Firestore operation; handle revoked/inactive profile errors without continuing to show action success. Consider whether to observe profile changes during a long-lived Staff session.
6. Ensure ADMIN checks also honor the intended active-account policy. Current `isAdmin()` checks sign-in and role but not `active` (`firestore.rules:26-28`); this is not a Staff feature change to make silently, but should be addressed before Admin is developed.

The current rules do not bind Staff reads/writes to a service/facility assignment (`firestore.rules:52-67`). This must be resolved before operational screens expose records.

## 9. Proposed Data Model Changes

Only change schema after user approval and a compatibility plan.

| Field/model | Current evidence | Proposal |
|---|---|---|
| `users/{uid}.facilityId` | Listed in Staff spec, not validated in `getActiveStaffProfile()` | Each Staff profile must resolve to exactly one facility; validate that it exists and is active before allowing Staff access. |
| Staff service assignment | Not currently enforced by profile/rules | Each Staff profile must resolve to exactly one service within its assigned facility. Use a canonical single-service field or a one-item representation only after checking existing schema/data; do not introduce multi-service assignment. Validate that the service belongs to the assigned facility and is active. |
| `name` / `displayName` | Staff spec lists `name`; proposed input mentions `displayName` | Keep one canonical field (recommend current `name`) unless separate public-display naming is required. |
| Queue lifecycle timestamps | `enteredAt`, `createdAt`, `updatedAt` written on creation; only `updatedAt` written during current status update | Record `calledAt`, `consultationStartedAt`, and `completedAt` on accepted transitions, preserving existing values on retries. |
| Cancellation/no-show event time | `CANCELLED` and `NO_SHOW` statuses exist; no dedicated timestamps are listed | Include `cancelledAt` for `WAITING → CANCELLED` and `noShowAt` for `CALLED → NO_SHOW`, written with server timestamps on accepted transitions. Preserve these values on idempotent retries; never use them as completion timestamps. |
| `predictions` | Described in Staff spec, no application producer/consumer found | No need to add for initial four screens. Revisit only after timestamp-backed history is trustworthy. |
| `auditLogs` | Spec schema exists; current rules permit Staff read but only Admin write (`firestore.rules:75-78`) | Decide whether Staff queue actions need an immutable audit trail and implement a trusted write path/appropriate rule before claiming audit logging. |

Avoid storing `queuePosition` as a durable source of truth; current patient behavior calculates it dynamically and specifications explicitly disallow permanent position storage.

## 10. Queue Lifecycle and Timestamp Design

### Existing behavior

- `createQueueEntry()` in `src/services/queueService.js:166-223` allocates a ticket and writes `status: "WAITING"`, `enteredAt`, `createdAt`, and `updatedAt` with Firestore `serverTimestamp()` inside a transaction.
- Its catch block creates an in-memory ticket and returns normally (`queueService.js:225-253`). This ticket has a client ISO timestamp and is not persisted or visible to other devices.
- `updateQueueEntryStatus()` writes `status`, arbitrary `additionalFields`, and `updatedAt: serverTimestamp()` (`queueService.js:274-295`). It does not validate previous status, set lifecycle times, or rethrow Firestore errors.
- `calledAt` and `consultationStartedAt` are documented schema fields but are not written by production source. `completedAt` is present in demo state and read by `CompletePage`; it is not written by the service automatically. `CompletePage` currently falls back to `updatedAt`/`createdAt` (`src/pages/patient/CompletePage.jsx:49-53`), which can misrepresent completion time.

### Recommended accepted transition mapping

| Transition | Writes |
|---|---|
| `WAITING → CALLED` | `status: "CALLED"`, `calledAt: serverTimestamp()`, `updatedAt: serverTimestamp()` |
| `CALLED → IN_CONSULTATION` | `status: "IN_CONSULTATION"`, `consultationStartedAt: serverTimestamp()`, `updatedAt: serverTimestamp()` |
| `IN_CONSULTATION → COMPLETED` | `status: "COMPLETED"`, `completedAt: serverTimestamp()`, `updatedAt: serverTimestamp()` |
| `WAITING → CANCELLED` | `status: "CANCELLED"`, `cancelledAt: serverTimestamp()`, `updatedAt: serverTimestamp()` |
| `CALLED → NO_SHOW` | `status: "NO_SHOW"`, `noShowAt: serverTimestamp()`, `updatedAt: serverTimestamp()` |

Preserve the names/casing used in the existing data. Do not stamp `completedAt` on cancellation or no-show.

### Active capacity and concurrency

The approved policy allows multiple tickets in `CALLED` and/or `IN_CONSULTATION` for the same service, but the combined active count must not exceed that service’s configured capacity. Do not assume the existing fallback `capacity` value is authoritative for live data. Resolve and validate the real service capacity, then enforce capacity atomically in a trusted transaction/backend or another concurrency-safe design; client-side counts alone are insufficient. Define which statuses consume a slot and how a slot is released before enabling actions. When capacity is reached, reject the competing action with a clear recoverable message and refresh the queue.

### Atomicity, retries and errors

**Recommendation:** use a Firestore transaction for each selected entry:

1. Read the entry and verify it exists, belongs to the authenticated user's authorized facility/service, and has the exact expected current status.
2. For the requested transition, validate the allowed edge; reject skipped/backwards changes.
3. Write only the permitted fields. Set the event timestamp only if absent on the first valid transition; preserve it on duplicate/retry. Set `updatedAt` for a committed state change.
4. Treat a repeated identical action as an explicit no-op/already-completed result, or a clear stale-state error; never silently advance to a different ticket.
5. If Firestore fails, reject the service promise and leave local state unchanged. Show retry/error feedback and rely on Firestore snapshots to converge after reconnection. Do not optimistically present a failed write as committed.

Two staff clients attempting the same entry transition then contend on the same document: one valid transaction commits, while the other observes the changed state on retry and returns stale/already-applied. A separate per-service active-capacity policy may require an additional coordination record or trusted backend operation; a transaction on a single entry alone cannot enforce a limit across arbitrary entries.

Rules must enforce the same transition and field constraints. A client-side transaction is not a substitute for rules. Existing records missing lifecycle fields must remain “unknown”; do not reconstruct event times from `createdAt` or generic `updatedAt`.

### Patient synchronization

Patient pages already listen to the queue entry (`TrackQueuePage.jsx:83-95`; `CalledPage.jsx:47-57`) and the current waiting queue (`TrackQueuePage.jsx:98-120`). Staff must update the same `queueEntries/{entryId}` record. When status leaves `WAITING`, the waiting query changes and other patients recalculate; the target patient’s document listener navigates to Called/Complete. Preserve these states and field names. Provide clear UI errors where listener/write failures currently only log or are not passed to a handler.

## 11. Security and Facility/Service Isolation Assessment

`firestore.rules` currently:

- `isStaff()` requires authenticated, `role == STAFF`, `active == true` (`:22-24`).
- `isAdmin()` does not check `active` (`:26-28`).
- Allows public reads of facilities/services (`:30-38`).
- Allows counter `get` publicly and has unauthenticated create/update predicates (`:40-50`).
- Allows queue-entry `get` publicly and `list` for Staff or when the entry is `WAITING` (`:52-54`).
- Permits unauthenticated queue creation under basic shape checks (`:55-61`) because patient accounts are not used.
- Permits any active Staff profile to update any queue entry with any allowed final status; it does not constrain old→new transition, mutable fields, facility, or service (`:62-67`).
- Allows a Staff user to list user documents under the `users` match (`:70-73`), not only their own document.
- Allows Staff reads but Admin-only writes of audit logs (`:75-78`).

**Potential risks, based on local rule text; live impact unverified:**

1. Service/facility isolation required by the Staff specification is not enforced.
2. A valid Staff account can request an allowed status without transition validation and can alter unrelated fields.
3. Public waiting-entry list/read access reveals at least queue-entry documents to anonymous callers; documents should remain strictly operational/minimal, and the acceptable ticket lookup/privacy tradeoff should be confirmed.
4. The unauthenticated counter predicates permit repeated increments of known counter docs (only by +1) and creation of a basic counter record. This can affect numbering/gaps; rate limiting or a trusted allocator may be required.
5. Staff list access to `users` could reveal profile data beyond the caller's own record.
6. Admin access does not currently require an active profile.

**Recommended enforcement:** scope every staff query and write by `facilityId` and an authorized `serviceId`/assignment stored in the authenticated user's profile; enforce exact allowed field changes and transition edges in rules; ensure missing/malformed assignments deny access. For any operation too complex to express safely in Firestore rules—especially anonymous ticket allocation or global active-capacity invariants—consider a trusted Cloud Function/backend. This is a design option only; the project currently has no such backend code.

`firebase.json` points to `firestore.rules` but is not evidence that the rules were deployed. `docs/decisions-log.md` states a prior dry-run failed at the Rules API request and an emulator attempt did not complete its wrapper checks; no deployment was reported. **Deployment status remains unverified.**

## 12. Reliability and Data Integrity Findings

| Finding | Evidence | Planning response |
|---|---|---|
| Ticket can appear successfully issued without a Firestore record | `createQueueEntry()` catches transaction errors and returns a generated memory ticket (`queueService.js:225-253`); Confirm page navigates when it receives a resolved object (`ConfirmQueuePage.jsx:90-113`). | Stop producing production success-shaped fallback tickets. Surface failure and prevent offline join, matching patient spec `:688-698`. |
| Local ticket numbers can collide | Fallback counts only this browser's memory entries and ignores other clients/persistent counter (`queueService.js:228-248`). | Only display a ticket as real after persistent transaction commit. |
| Failed status mutation may appear successful | `updateQueueEntryStatus()` catches/logs and resolves anyway (`queueService.js:274-295`). | Reject with explicit error; don't mutate fallback store on a failed persisted write. |
| Invalid or duplicate lifecycle actions can be accepted | No prior-state read/transition guard in status update; rules allow any enum state (`queueService.js:274-281`, `firestore.rules:62-66`). | Transactional state validation plus equivalent rules validation and idempotent retry semantics. |
| Lifecycle events absent | Production writes `updatedAt`, not call/start/complete event times (`queueService.js:194-204, 274-295`). | Record actual server event timestamps on valid transitions before history/analytics. |
| UI can diverge when service returns volatile data | Firestore read failures fall back to `memoryQueueStore`; no persisted state is shared across clients (`queueService.js:150-161, 225-253`). | Clearly distinguish offline/unavailable state and never imply Firestore authority from local-only data. |
| Patient estimate/history cannot use measured service time yet | No lifecycle writer or predictions producer; estimates use seven-minute constant. | Capture valid timestamps; then establish measured distributions before changing estimates. |
| Race for “call next” needs a clear capacity invariant | No staff action or server-side one-active-item policy currently exists. | Define capacity rule and atomically enforce it before enabling UI actions. |
| Fallback service/facility data can hide read errors | `getServices()` and `getFacility()` return local fallback data (`queueService.js:38-127`). | For Staff authorization/context, do not use these fallbacks as proof of an active assigned facility/service; surface configuration/network state. |

## 13. AI and Waiting-Time Plan

### Current implementation

- `calculateQueuePosition()` in `src/utils/queue.js:40-105` filters/sorts waiting entries and calculates position.
- `BASELINE_MINUTES_PER_PERSON` is fixed at 7 (`src/constants/queueConstants.js:16-17`).
- Display range is a set of hard-coded branches (position 1, position 2, positions 3–4, then a 7-minute per-person lower estimate plus 15 minutes) in `queue.js:83-104`.
- No AI/ML SDK/API, inference code, backend prediction function, or source use of Firestore `predictions` collection was found. The Staff specification documents a planned prediction schema (`WaitWise_Staff_Website_Agent_Spec.md:596-610`), not a functioning prediction service.

### Recommended incremental path

1. Fix queue persistence and capture clean `enteredAt`, `calledAt`, `consultationStartedAt`, and `completedAt` server timestamps.
2. Record outcomes without patient names/medical details; separate completed consultations from cancellations and no-shows.
3. Build a historical baseline per facility/service (sample size, median and percentile wait/service duration); define timezone and missing/outlier handling.
4. Compare a rolling median/mean-based estimator with today's fixed seven-minute baseline on a later-in-time holdout period. Measure errors (for example, MAE and median absolute error) and report sample sizes.
5. Only consider ML if representative, sufficiently complete data exists and a statistical baseline has measurable shortcomings. Do not promise an arbitrary sample threshold without evaluating service variability.
6. Display prediction quality/advisory wording within Dashboard or Queue Management; do not create a fifth screen. Estimates must never decide triage, emergency prioritization, or override qualified staff.

## 14. Testing Strategy

### Existing test evidence

- No formal test framework or `test` script is declared by `package.json`.
- `scratch/verify_queue_data.mjs` checks sample FIFO/position calculations with console assertions; it does not test Firestore or Staff UI.
- `scratch/test_service_queue.mjs` performs queue reads, creates an entry, and calls status update. It includes a hard-coded `entry_pat_A`; execution could touch configured Firestore data.
- `scratch/test_screens_6_to_8.mjs` says it exercises a live Firestore scenario, expects Staff credentials from environment, creates queue entries, and mutates statuses; it explicitly does not represent an isolated emulator test.
- No conventional unit/integration test files were found. `firebase.json` has no emulator block. `docs/decisions-log.md` describes a previous emulator attempt that did not complete its test wrapper checks. No tests were run for this plan.

### Future test matrix

| Area | Tests | Environment |
|---|---|---|
| Auth/profile | Valid Staff; wrong role; inactive; missing profile; malformed facility/services; read failure; session restore/sign-out | Auth + Firestore Emulator with seeded test identities/data |
| Route protection | Signed-out route redirects; signed-in inactive/misconfigured account is denied; URL/route state cannot change assignments | Component/router tests plus Emulator rules tests |
| Assignment security | Assigned facility/service can read; unassigned service/facility cannot read/update; Staff cannot list other users unnecessarily | Firestore Rules Unit Testing against Emulator |
| Dashboard | Counts/status grouping, no active queue, no completed data, read failures, timezone boundary | Unit + Emulator/integration |
| Queue ordering | FIFO with server timestamps, ties, missing timestamps, status exclusion, only next eligible action | Pure unit tests for `queue.js`; component tests |
| Lifecycle | Each valid edge and forbidden edge; timestamps set once; repeated click idempotence; missing legacy timestamp; cancelled/no-show handling | Queue service unit/integration and Emulator |
| Concurrency | Two staff clients call same ticket; stale action does not duplicate/advance; capacity limit held under simultaneous calls | Emulator multi-client integration, or trusted backend test if backend chosen |
| Firestore errors/offline | Create/update/listener permission/network errors are visible; no memory-only fake success; retry maintains ticket identity/state | Emulator fault/permission tests and browser integration |
| Patient regression | Join persists once; Ticket/Track reflects staff CALLED/COMPLETED transition; Almost Next position changes; failed create never routes to ticket | Browser end-to-end against Emulator |
| History | Facility/service filters, statuses, date boundaries, pagination, empty/error; no unsupported names; no fake event times | Emulator integration and UI tests |
| Visual/responsive | Four screens match approved Staff references, no horizontal overflow, accessible action labels, loading/error states | Browser/visual verification; screenshots are not replaced by build checks |

Before using any existing `scratch/` integration script, route its Firebase config to a dedicated Emulator/test project, provide non-production credentials if required, and ensure teardown/cleanup. Do not run the current live-target scripts against production or a shared project.

## 15. Phased Implementation Roadmap

| Phase | Purpose and work | Prerequisites | Expected outcome / verification |
|---|---|---|---|
| 0. Decide boundaries | Preserve four operational screens and login gate; implement one facility + one service per Staff member; allow multiple active patients up to validated service capacity; include cancellation/no-show with dedicated event timestamps; define exact editable personal fields. Review Firebase setup before choosing Emulator vs dedicated test project. | Most scope decisions recorded; exact editable fields and test environment remain open. | Decisions log captures approved decisions and remaining gates; no implementation until the Firebase test target is safely identified. |
| 1. Secure data contract | Finalize profile shape; enforce staff active/role/facility/service checks and field/transition limits in rules; resolve anonymous ticket counter strategy. | Phase 0; access to Rules Emulator/test project. | Rules tests prove assigned access succeeds and unassigned/invalid operations fail; deployment status not assumed. |
| 2. Make queue operations reliable | Strengthen `queueService.js`: no volatile success ticket, explicit errors, real-time error handling, atomic validated transitions, first-write server timestamps, idempotent retries. | Phase 1; agree legacy timestamp handling. | Unit/Emulator tests verify no false success, timestamps preserved, invalid transitions rejected. |
| 3. Staff shell and Dashboard | Add protected routes/layout and dashboard stats scoped to the profile; handle loading/empty/error and bounded completed counts. | Validated profile and query API. | Four operational routes exist; dashboard shows only authorized context and metrics. |
| 4. Queue Management (one screen) | Live waiting and active records for the one assigned service, FIFO eligibility, inline selected-ticket consultation panel, start/complete actions, cancellation and no-show actions, and capacity-aware active queue handling. | Phase 2; validated service capacity and concurrency-safe enforcement. | Multi-client tests prove active count cannot exceed capacity; approved lifecycle transitions work and patient snapshots remain compatible. |
| 5. Queue History | Add bounded, paginated status/date query for assigned context; expose only real values and mark missing timestamps. | Valid event timestamp rules and final query shapes. | Emulator tests verify scope, filters, pagination, and missing historical fields. |
| 6. Profile and Settings | Display authenticated profile and single facility/service assignment; permit only confirmed personal-detail fields to be edited; sign out securely. | Confirm exact editable fields against the current profile schema. | Staff cannot alter role/status/facility/service; allowed personal edits and sign-out are verified. |
| 7. End-to-end and visual verification | Exercise Patient→Staff→Patient workflow, errors, responsive references, and rules after all four main screens are complete. | Phases 1–6; isolated test project/emulator. | Build/lint, rules tests, integration tests, and browser verification recorded separately. |
| 8. Historical analytics baseline | Aggregate valid operational timestamps, evaluate observed wait/service distributions against fixed estimate. | Reliable history accumulation and privacy/retention decisions. | Baseline metrics and errors reported by service with counts and caveats. |
| 9. Optional model assessment | Evaluate whether a simple statistical/ML estimator improves over baseline; deploy only with an approved secure execution path. | Phase 8 shows enough representative records and a validated holdout. | Documented accuracy and calibration; advisory-only estimate integrated into existing screens. |

Admin-side UI is intentionally outside this Staff plan. A later Admin project should follow after these four screens, with separate requirements/authorization review.

## 16. Risks, Assumptions, and Unresolved Questions

### Confirmed risks

- Queue creation silently changes to a session-only local record after Firestore transaction failure (`queueService.js:225-253`), contradicting the patient spec's no-offline-join requirement (`WaitWise_Patient_Website_Agent_Spec.md:688-698`).
- Queue status updates can resolve after Firestore failure, do not validate transitions, and do not automatically write lifecycle timestamps (`queueService.js:274-295`).
- Rules do not scope Staff by facility/service or transition edge (`firestore.rules:52-67`).
- No Staff screens beyond login or test framework are present.

### Potential risks

- Simultaneous calls, service capacity, and active consultation concurrency are undefined in current code. `capacity: 1` appears in fallback service objects (`src/constants/queueConstants.js:20-66`) but there is no enforceable active-slot rule in queue code/rules.
- Public access to waiting queue documents may expose ticket/status metadata. Current schema intentionally avoids patient names, but the acceptable disclosure and tracking-ID threat model should be confirmed.
- Daily ticket-counter date uses UTC (`queueService.js:171`); desired clinic-local day boundary is not specified.
- Staff history date and outcome timestamp behavior cannot be correct until terminal event timestamps and indexes are defined.

### Unverified deployment/data

- Whether `firestore.rules` is deployed and identical to the local file.
- Actual production user profile documents and whether any have service assignments.
- Actual Firestore indexes, live dataset quality, enabled Auth providers, current traffic, and whether any external Functions/AI services exist outside this repository.
- Staff reference screenshot fidelity and live login behavior have not been browser-verified in this planning task.

### Approved owner decisions (2026-10-09)

1. **Staff assignment:** exactly one facility and exactly one service per Staff member. All profile validation, dashboard/history queries, queue reads/writes, and Firestore rules must enforce this scope.
2. **Active queue:** multiple patients may be `CALLED` and/or `IN_CONSULTATION` at once, up to the assigned service’s configured capacity. Capacity must be enforced with a concurrency-safe trusted operation, not just UI logic. The precise slot-counting/release invariant must be documented before implementation.
3. **Cancellation/no-show:** include both in the first release: `WAITING → CANCELLED` and `CALLED → NO_SHOW`. Add server-written `cancelledAt` and `noShowAt` timestamps.
4. **Profile editing:** allow limited personal-detail editing. Keep role, active status, facility, and service assignment read-only. Confirm the exact editable field names from the existing profile schema before implementation.
5. **Testing environment:** intentionally undecided until the current Firebase setup is reviewed. Do not run live-target scratch scripts or mutate shared/production data while reviewing.

### Remaining decisions / checks before implementation

1. What facility-local timezone defines “today” for dashboard counts and daily ticket numbering?
2. Should anonymous queue allocation remain directly client-side under constrained Firestore rules, or move to a trusted backend? This choice affects security and reliability.
3. What is the retention/privacy policy for queue history and aggregate analytics?
4. Which existing personal profile fields are safe and intended for self-service editing? Inspect the schema first; do not invent fields.
5. After reviewing `firebase.json`, Firebase project aliases/configuration, available emulator setup, and safe credentials, choose Firebase Emulator or a dedicated test project. Never assume the currently configured target is safe for tests.
## 17. Files Expected to Change in a Future Implementation

**Likely existing files to update after approval:**

- `src/App.jsx` — four protected Staff routes plus retained login gate.
- `src/services/queueService.js` — scoped reads/listeners, robust errors, transaction-backed lifecycle operations.
- `src/services/firebase/staffAuth.js` — assignment shape and profile validation.
- `firestore.rules` — Staff facility/service isolation, transition/field validation, active admin check if approved, and safe ticket allocation strategy.
- `firestore.indexes.json` — only indexes required by confirmed dashboard/history queries.
- `src/constants/queueConstants.js` / `src/utils/queue.js` — only if the existing shared status/ordering helper needs a verified change; preserve all status strings.
- `src/pages/patient/ConfirmQueuePage.jsx` and patient feedback/error surfaces — only as needed to prevent false ticket success and preserve Patient UX.
- `src/pages/patient/TrackQueuePage.jsx`, `CalledPage.jsx`, `CompletePage.jsx` — only if needed to accurately surface real lifecycle times and preserve real-time state.
- `docs/decisions-log.md` — record confirmed decisions and accurate testing status.

**Likely new files, subject to avoiding unnecessary component proliferation:**

- `src/pages/staff/StaffDashboardPage.jsx`
- `src/pages/staff/StaffQueuePage.jsx`
- `src/pages/staff/StaffHistoryPage.jsx`
- `src/pages/staff/StaffProfilePage.jsx`
- `src/components/staff/StaffLayout.jsx`
- `src/components/staff/QueueEntryRow.jsx`
- `src/components/staff/ActiveConsultationPanel.jsx` (inline in Queue Management; not a separate screen)
- `src/styles/staff.css`
- Test files and emulator test setup once the test stack/environment is approved.

If authorized after planning, create the four screens incrementally; do not create `CurrentConsultationPage.jsx` or a `/staff/consultation` route.

## 18. Files to Leave Untouched Unless Verified Requirement Demands Change

- Patient visual references/assets under `design-reference/DESIGNS/` and `design-reference/STAFF/`.
- Existing patient-only components/styles except for a narrowly necessary error/status compatibility change.
- `src/services/firebase/config.js`, `auth.js`, and `firestore.js` initialization. Reuse the existing Firebase app; do not reinitialize.
- `src/constants/devDemoState.js` and `/dev/screen-*` preview routes, except a demonstrated issue tied directly to production routing.
- `package.json` and lock/dependency files; no new library is presently justified.
- Admin pages/components or an Admin dashboard; outside this scope.
- The existing user/service/queue data in Firestore; no migrations or live data changes are authorized by this plan.
- Existing audit reports. They are reference material and should not be overwritten by implementation planning.

## 19. Verification Checklist Before Implementation Begins

- [ ] Four authenticated operational screens are agreed; login remains the entry gate, not a separate main feature screen.
- [ ] `Current Consultation` is kept inline in Queue Management; no fifth Staff screen/route is planned.
- [x] Assignment policy is agreed: exactly one facility and one service per Staff member; verify the current schema and enforce it consistently in profile, queries, rules, and UI.
- [x] Active queue policy is agreed: multiple active patients up to service capacity; the capacity invariant and concurrency-safe enforcement still must be designed and tested.
- [x] Cancellation and no-show are approved for the first release, with `cancelledAt` and `noShowAt` server timestamps.
- [ ] Exact editable personal profile fields are confirmed against the current schema; assignments and access state remain read-only.
- [ ] Testing target is selected only after Firebase setup review; isolate the Emulator or dedicated test project and never run live-test scripts against production/shared data.
- [ ] Existing queue records with missing timestamps have a documented “unknown” policy; no fabricated backfill.
- [ ] Planned query shapes, pagination ordering, and necessary indexes are validated.
- [ ] Anonymous ticket creation/counter enforcement is reviewed; failed Firestore creation cannot look like success.
- [ ] Read/write/listener errors are surfaced; retries are idempotent and do not create duplicate tickets or advance to another patient.
- [ ] Rules are tested for assigned/unassigned facility/service, invalid transitions, protected profile fields, and patient access.
- [ ] Staff and patient synchronization is tested end-to-end with Firestore snapshots.
- [ ] All four screens have loading, empty, error/permission, and responsive visual checks.
- [ ] `npm run build`, `npm run lint`, unit/integration/rules tests, and browser checks are reported as separate results; none is marked tested unless actually run.
- [ ] Any eventual deployment of Firestore rules/functions is an explicit, separately approved action.

