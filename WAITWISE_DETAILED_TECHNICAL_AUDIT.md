# WaitWise Detailed Technical Audit

**Audit date:** 2026-10-09  
**Scope:** Read-only source/specification review. This report is the only project file created for this task. No application source, dependency, or Firebase configuration was changed.

## Evidence labels and limits

- **Confirmed** — directly visible in the inspected source or documentation.
- **Potential risk** — the code permits a problematic outcome, but exploitability or production impact depends on deployment/data context.
- **Unverified** — requires checking the live Firebase project, runtime environment, or data not available in the source tree.

Line references below refer to the current source snapshot reviewed on the date above. A specification describes intent, not proof of deployed configuration or live database contents.

## Executive Findings

1. **Confirmed — queueing and ticket generation exist, but an error fallback can make a non-persistent ticket look successful.** `createQueueEntry()` normally writes a counter and queue entry atomically in a Firestore transaction (`src/services/queueService.js:166-223`); its catch path instead returns an in-memory ticket (`:225-253`). This conflicts with the patient spec's requirement not to issue a new ticket offline (`WaitWise_Patient_Website_Agent_Spec.md:688-698`).
2. **Confirmed — status updates do not currently record lifecycle timestamps.** `updateQueueEntryStatus()` writes `status`, caller-provided fields, and `updatedAt` only (`src/services/queueService.js:274-295`). No application source writes `calledAt` or `consultationStartedAt`; `completedAt` occurs in a development preview and is read by the completion page, but is not written by a production status action.
3. **Confirmed — the current estimate is a fixed rule, not AI or a historical predictor.** `calculateQueuePosition()` uses the number of waiting entries and a seven-minute constant, with hand-set text ranges (`src/utils/queue.js:40-105`; `src/constants/queueConstants.js:16-17`).
4. **Confirmed — Staff screens beyond login and all Admin screens are absent.** `src/App.jsx:23-47` registers `/staff/login` and patient routes; `src/pages/staff/` contains only `StaffLoginPage.jsx`. No staff dashboard, queue-management, consultation, history, settings, or admin route is implemented.
5. **Potential risk — current Staff authorization is role-wide, not facility/service-scoped.** The staff profile checker accepts only role `STAFF` and `active === true` (`src/services/firebase/staffAuth.js:15-22`), but does not return a validated service assignment. The user schema in the staff specification lists `facilityId` but not `serviceId` (`WaitWise_Staff_Website_Agent_Spec.md:498-520`). Firestore rules authorize any active Staff member to list queue entries and update any queue entry (`firestore.rules:52-67`).
6. **Confirmed — the `predictions` collection is specified but not implemented.** It is described in both project specifications, but no source code generates or reads prediction records. The `firebase` package is present; no AI/ML provider SDK or model integration was found in the inspected source or package manifest.

## 1. `src/services/queueService.js`

### 1.1 In-memory fallback and listener notification

- `memoryQueueStore` and `memoryListeners` are module-level, process-local state (`:18-22`).
- `notifyMemoryListeners()` passes a shallow copy of the current array to each listener (`:24-34`). Callback exceptions are caught and logged with `console.warn`; that prevents one listener failure from interrupting other callbacks.
- **Confirmed limitation:** this store is not durable, shared between browsers, or a Firestore offline cache. Its entries disappear on reload and are not visible to another device/staff client.

### 1.2 Service and facility reads

- `getServices(facilityId)` queries active services for the facility (`:38-49`), normalizes display order/name/description (`:51-91`), and falls back to `INITIAL_SERVICES` after an empty result or caught error (`:95-105`).
- `getFacility(facilityId)` reads Firestore and falls back to a literal Main Health Centre/Lusaka object after a missing document or caught error (`:108-127`).
- **Potential risk:** these fallbacks return success-shaped data after a read failure. A caller cannot tell from the return value whether the database returned live data or the fallback. The UI can therefore show the seeded catalog/facility when Firestore is unavailable. This fallback is distinct from queue-entry fallback because it does not itself create a queue record.

### 1.3 Waiting queue reads

- `getServiceQueue(facilityId, serviceId)` queries `queueEntries` filtered by facility, service, and status `WAITING` (`:132-148`).
- If Firestore throws, it logs and returns matching waiting entries from the local memory store (`:150-161`). When Firestore returns a valid but empty snapshot, it returns that empty snapshot; it does not merge local entries into it.
- **Confirmed scope:** this is a waiting-only query. It cannot supply the active `CALLED`/`IN_CONSULTATION` item or historical `COMPLETED`/`CANCELLED`/`NO_SHOW` items needed by the staff consultation/history views.

### 1.4 Queue creation and ticket transaction

`createQueueEntry({ facilityId, serviceId, ticketPrefix })` (`:166-253`):

1. Uses a UTC date string from `new Date().toISOString().split("T")[0]` and forms a counter ID from facility, service, and date (`:172-175`).
2. Allocates a Firestore queue document reference, then calls `runTransaction()` (`:176-178`).
3. Reads the counter. If absent, it sets `nextNumber: 2` and uses ticket sequence 1; otherwise it reads `nextNumber` (or defaults it to 1) and increments the counter (`:178-192`).
4. In the same transaction, writes the queue entry with ticket code, facility/service IDs, `WAITING`, server-generated `enteredAt`, `createdAt`, and `updatedAt`, plus `entryMethod: "patient"` (`:194-204`). The counter and queue entry writes are atomic if the transaction succeeds.
5. Returns a client object with the assigned Firestore ID and ticket code, but local ISO-string timestamps, and adds that object to the memory store (`:206-223`).

**Concurrency:** the normal path's Firestore transaction is the appropriate mechanism to serialize simultaneous counter increments for the same counter document. Actual concurrent behavior and deployed rules were not tested in this audit.

**Confirmed critical behavior gap:** the catch block catches any transaction error, including network or permission errors, and generates a locally numbered ticket from the current tab's memory store (`:225-253`). It then returns this object as if ticket creation succeeded. The fallback sequence is based on entries in this browser session, filtered by `serviceId` and prefix only (`:228-232`), not on the persistent daily facility/service counter. It can collide with another session or a real ticket, and it does not create a Firestore queue entry. This makes Firestore unavailable/error indistinguishable from successful queue entry creation at the call site. It also conflicts with the patient spec's explicit offline-ticket restriction (`WaitWise_Patient_Website_Agent_Spec.md:688-698`).

**Additional potential risk:** `today` is UTC, so a counter's reset date can differ from the facility's local calendar day around midnight. Whether that is undesirable depends on the intended numbering policy.

### 1.5 Single-entry read and status update

- `getQueueEntry(entryId)` reads the Firestore document and falls back to a matching in-memory entry on error or missing Firestore record (`:256-268`). A missing Firestore document is therefore also indistinguishable from an unpersisted locally generated entry if the ID is in memory.
- `updateQueueEntryStatus(entryId, newStatus, additionalFields = {})` uses `updateDoc()` with `{ status: newStatus, ...additionalFields, updatedAt: serverTimestamp() }` (`:274-281`).
- **Confirmed:** it does not add `calledAt`, `consultationStartedAt`, or `completedAt`, validate the requested transition, read the current state, or create an audit log.
- **Confirmed error-handling gap:** on any `updateDoc()` error it logs but continues (`:282-284`), mutates the local copy if present, notifies listeners, and resolves normally (`:286-295`). A future Staff UI awaiting this function could indicate success despite Firestore rejecting the action. Local state may diverge from the database.
- **Confirmed field-overwrite issue:** because `additionalFields` is spread after `status`, a caller can override `newStatus` by passing `additionalFields.status`. It can also supply lifecycle fields, including stale client timestamps. This is not currently called from an implemented staff page, but should be addressed as part of the API contract before Staff actions rely on it.

### 1.6 Real-time subscriptions

- `subscribeToQueueEntry(entryId, onUpdate, onError)` subscribes to a single Firestore document with `onSnapshot()` (`:299-325`), forwards snapshot data, and optionally forwards asynchronous listener errors. It also subscribes to the local memory listener set and sends any matching initial memory entry (`:323-337`).
- `subscribeToServiceQueue(facilityId, serviceId, onUpdate, onError)` subscribes to the same three-filter `WAITING` query used by `getServiceQueue()` (`:341-365`), and also forwards filtered local-memory queue data (`:369-396`).
- Both return cleanup functions that unsubscribe Firestore and remove local callbacks (`:332-337`, `:392-396`).
- **Confirmed caveat:** both APIs catch synchronous subscription setup errors and only log them (`:317-320`, `:367-370`); they do not call the supplied `onError` for those synchronous failures. In current patient call sites, no `onError` is supplied, so asynchronous Firestore subscription errors are not surfaced in the UI either.
- **Staff implication:** `subscribeToServiceQueue()` intentionally only yields waiting entries. Staff Queue Management needs an additional subscription/read for the currently called/in-consultation entry (or a thoughtfully scoped query of all relevant statuses), while History needs completed/cancelled/no-show records. Do not repurpose the waiting-only API as though it returns the full operational queue.

## 2. `src/utils/queue.js` and `src/constants/queueConstants.js`

### 2.1 Supporting helpers

- `formatOrdinal(n)` clamps/parses a position to at least 1 and formats suffixes (`src/utils/queue.js:6-13`).
- `getTimestampMillis(ts)` supports Firestore Timestamp-like values, Date, numeric milliseconds, and parseable strings; invalid/falsy inputs become zero (`:16-31`).

### 2.2 Exact current queue position logic

`calculateQueuePosition(entries = [], currentEntryId = null)` (`src/utils/queue.js:40-105`):

1. Keeps entries whose status is exactly the configured `WAITING`; an entry with no status is treated as `WAITING` (`:41-49`).
2. Sorts FIFO by `enteredAt || createdAt` if both entries have truthy timestamps and their values differ. Otherwise it sorts by ticket code using numeric-aware locale comparison (`:51-59`).
3. With no `currentEntryId` (prospective patient on confirmation), sets people ahead to the entire waiting queue size (`:61-66`). With an ID/code, it finds that item in the filtered waiting list; if not present, assumes it joins after all currently waiting entries (`:67-78`).
4. Position is `peopleAhead + 1` and formatted as an ordinal (`:80-81`).

**Potential ordering caveat:** if one entry has a timestamp and another has no usable timestamp, the comparator falls back to ticket code rather than placing the missing timestamp consistently before/after the dated entry. Historical entries with mixed timestamp quality can therefore be ordered by ticket text rather than true arrival time.

### 2.3 Exact waiting-time calculation

`BASELINE_MINUTES_PER_PERSON` is set to 7 (`src/constants/queueConstants.js:16-17`). The estimate implementation (`src/utils/queue.js:83-105`) uses:

| Current position | Displayed estimate |
---|---|
| 1 | `Under 10 minutes` |
| 2 | `5 – 15 minutes` |
| 3–4 | `15 – 30 minutes` |
| 5+ | minimum = max(20, `peopleAhead * 7`); maximum = minimum + 15 |

It also returns `estimatedWaitMinutes = position * 7` regardless of the display-range branch (`:99-104`). That numeric value does not necessarily equal the displayed range's midpoint or lower bound; position 1, for example, returns 7 with text “Under 10 minutes.”

**Confirmed classification:** this is deterministic rule-based logic. It does not read historical service durations, `predictions` documents, current consultation duration, staffing, service capacity, time of day, or an ML model. `peopleAhead` and the baseline alone drive it. The language “predictive” in project planning does not make this AI/ML.

## 3. Routes and Staff Functionality

### 3.1 `src/App.jsx`

- Imports eight patient pages plus `StaffLoginPage` (`:1-10`).
- Registers `/staff/login` at `:23`.
- Registers patient routes `/`, `/join`, `/confirm`, `/ticket`, `/track`, `/almost-next`, `/called`, `/complete` at `:26-47`.
- Registers `/dev/screen-4` through `/dev/screen-8` only when `import.meta.env.DEV` is true (`:49-73`).
- Unknown routes redirect to `/` (`:75-77`).

**Confirmed:** there is no Staff route guard/layout, dashboard, queue, consultation, history, settings, or Admin route here. `/almost-next` is implemented even though the patient's enumerated route list omits it; the patient's flow includes the Almost Next state elsewhere in the spec.

### 3.2 `src/pages/staff/`

The only page found is `StaffLoginPage.jsx`; there are no staff components under `src/components/staff/` and no admin pages/components. The glob inspection of these folders found only `src/pages/staff/StaffLoginPage.jsx`.

`StaffLoginPage` (`src/pages/staff/StaffLoginPage.jsx:69-267`) implements:

- Email/password sign-in (`:123-137`) via `signInStaff()`.
- Auth-state/session check and profile revalidation (`:79-118`).
- Password reset (`:139-157`) with neutral “if an account exists” success feedback.
- Sign out (`:159-168`).
- Form loading, password visibility, and user-facing auth/network errors (`:50-67`, `:184-267`).
- An authorized signed-in state that remains on `/staff/login` and offers sign-out (`:185-196`); it does not navigate into Staff operations.

This matches the Stage 1A decision noted in `docs/decisions-log.md`: login was implemented; live account verification and actual Firebase-backed behavior were explicitly not tested there.

### 3.3 `src/pages/patient/` evidence relevant to this audit

- `ConfirmQueuePage.jsx:90-96` passes `service.code` as `ticketPrefix` to `createQueueEntry()`. The service must therefore provide the expected code if its ticket prefix is to match the defined catalog.
- `TrackQueuePage.jsx:54-124` fetches the waiting queue once and subscribes both to the individual entry and the waiting queue. It recalculates position and navigates on `CALLED` or `COMPLETED`.
- `CalledPage.jsx:42-60` subscribes to the entry and navigates to completion on `COMPLETED`.
- `CompletePage.jsx:49-53` formats completion time from `completedAt || updatedAt || createdAt`; because application status updates currently write only `updatedAt`, the displayed time may represent a later/general update rather than a true completion time.
- `TrackQueuePage.jsx:32-38`, `CalledPage.jsx:27-38`, and `CompletePage.jsx:24-36` include hard-coded fallback example ticket/service/facility data if active ticket state is absent. Patient spec says screenshot examples such as A106 must not become live ticket data (`WaitWise_Patient_Website_Agent_Spec.md:231`, `:515-519`). Those fallbacks are a production-route discrepancy unless an explicit preview mode is set.

## 4. Authentication, Authorization, and Firestore Rules

### 4.1 `src/services/firebase/staffAuth.js`

- `subscribeToAuthState()` wraps Firebase `onAuthStateChanged()` (`:11-13`).
- `getActiveStaffProfile(uid)` reads `users/{uid}` and returns `null` unless the document exists, `role === "STAFF"`, and `active === true` (`:15-23`).
- `signInStaff()` authenticates with email/password, checks the profile, and signs out if the profile check fails (`:25-40`).
- Password reset and sign out delegate to Firebase Auth (`:43-49`).

**Confirmed boundary:** the client profile check is useful UI/session gating, but by itself is not an authorization boundary. Firestore rules separately check staff role/active state for their protected operations.

**Confirmed missing scope in this helper:** it does not check that the profile has a facility/service assignment or bind a staff session to one queue. The Staff spec requires service isolation (`WaitWise_Staff_Website_Agent_Spec.md:81-101`, `:464-490`), but its user schema lists `name`, `email`, `role`, `facilityId`, `active`, `createdAt` and does not list `serviceId` (`:498-520`). The intended assignment mechanism must be resolved before service-scoped screens can be securely built.

### 4.2 `firestore.rules`

- `isStaff()` requires sign-in, role `STAFF`, and `active == true` (`:22-24`).
- `isAdmin()` checks signed-in role `ADMIN`, but does **not** check `active == true` (`:26-28`).
- Facilities/services are publicly readable and writable by Admin (`:30-38`).
- Counter documents allow public `get`, Staff-only `list`, and create/update conditions without an authentication check (`:40-50`). Counter creation validates only basic fields and `nextNumber == 2`; update enforces a +1 increment and limits changed keys to `nextNumber`.
- Queue entries allow public `get`; `list` is allowed to Staff or when the entry's status is `WAITING` (`:52-54`). Public read/list visibility of waiting tickets is therefore part of the current rules, consistent with anonymous patient tracking but worth considering in the privacy model.
- Queue creation is unauthenticated if the status and a few fields meet the listed constraints (`:55-61`). This is consistent with patient accounts being absent, but the rules do not bind the ticket code to a counter transaction or verify that facility/service IDs refer to active records.
- Queue updates require an active Staff role and a status from the allowed enum (`:62-66`). They do not restrict changed keys, enforce valid transitions, or scope a staff member to the entry's facility/service. Thus a staff client authorized under these rules can update entries across service/facility boundaries and may change other fields along with status.
- `users` reads are allowed for a signed-in user’s own doc or any Staff user; Admin may write (`:70-73`). `auditLogs` reads are open to any Staff member and writes are Admin-only (`:75-78`).

**Potential risks (confirmed rule shape; production impact unverified):**

1. An active Staff identity is authorized across all queue entries, without an assignment check; this conflicts with required service isolation.
2. Status transitions are not constrained by old/new state. The rules accept any allowed destination status, including backwards or skipped transitions.
3. Counter create/update authorization is not explicitly limited to authenticated callers. The exact effect depends on live rules and client operations, but arbitrary counter tampering should be threat-modelled.
4. Any Staff user can read all user documents through list queries permitted by the rule, not only their own profile.
5. `isAdmin()` does not require an active user profile.

**Unverified:** whether these exact rules are deployed, whether deployed indexes support all future queries, and how existing Firebase data is populated. Source review cannot establish live deployment state.

## 5. Specification-to-Implementation Comparison

### 5.1 Patient specification

Relevant documented intent:

- Firestore services, live ticket creation and values, FIFO queue, dynamic position, real-time updates, and no permanent position field (`WaitWise_Patient_Website_Agent_Spec.md:167-231`, `:611-656`).
- Patients do not create accounts; local storage is convenience only and Firestore is source of truth (`:535-551`, `:660-682`).
- A connection failure should display last known state, preserve the real ticket, and must not create another ticket offline (`:688-698`).
- Status flow includes `WAITING → CALLED → IN_CONSULTATION → COMPLETED`, plus `WAITING → CANCELLED` and `CALLED → NO_SHOW` (`:611-621`).
- The flow includes the Almost Next state, but the explicit route list at `:575-600` does not list `/almost-next`.

Comparison:

- **Implemented:** selection reads services through `getServices()`, entry creation attempts a Firestore transaction, queue position is calculated rather than stored, and patient status/queue listeners exist.
- **Partially implemented:** transactional persistence works on the normal success path; the error fallback returns a volatile local ticket, contrary to the explicit offline restriction. Real-time listener errors do not reach the current patient UI call sites.
- **Not implemented in the inspected source:** lifecycle timestamp writes for staff transitions, connection-state messaging/last-known-state handling surfaced by these queue service APIs, and a Staff-backed source for terminal statuses.
- **Discrepancy:** hard-coded fallback ticket data can appear outside dev preview routes as noted above.

### 5.2 Staff specification

The staff spec requires service-isolated staff access, service-neutral navigation, a service-aware dashboard, a single eligible FIFO call action, the lifecycle transitions, a current consultation screen, timestamp-backed history, and Firebase real-time/error states (`WaitWise_Staff_Website_Agent_Spec.md:81-144`, `:185-331`, `:348-390`, `:633-686`).

Its data model describes:

- `users/{uid}` with `facilityId` but no service assignment (`:498-520`).
- Queue fields including `enteredAt`, `calledAt`, `consultationStartedAt`, `completedAt` (`:566-590`).
- `predictions` and `auditLogs` schemas (`:596-620`).

Comparison:

- **Implemented:** Stage 1 login only; role/active profile check and reset/sign-out functionality exist.
- **Not implemented:** dashboard, queue management, consultation, history, settings, service-isolated assignment, queue mutation flows, lifecycle event timestamps, prediction record producer, and staff audit-log writer.
- **Specification inconsistency to resolve:** the staff workflow requires assigned/current service and strict service isolation, but the listed `users` fields do not contain a service assignment. Do not guess an authorization source (for example, multiple-service assignment vs. one service field) when implementing.
- **Documented screen sequence:** Login, Dashboard, Queue Management, Current Consultation, History, Settings (`WaitWise_Staff_Website_Agent_Spec.md:820-832`).

## 6. Lifecycle Timestamp Design (recommendation only; not implemented)

### 6.1 Recommended event mapping

Use server timestamps on the **first accepted transition into** each lifecycle state:

| Accepted transition | Status written | Timestamp written |
|---|---|---|
| `WAITING → CALLED` | `CALLED` | `calledAt: serverTimestamp()` |
| `CALLED → IN_CONSULTATION` | `IN_CONSULTATION` | `consultationStartedAt: serverTimestamp()` |
| `IN_CONSULTATION → COMPLETED` | `COMPLETED` | `completedAt: serverTimestamp()` |
| `WAITING → CANCELLED` | `CANCELLED` | no consultation lifecycle timestamp |
| `CALLED → NO_SHOW` | `NO_SHOW` | no consultation-start/completion timestamp |

These are the paths specified by the staff spec (`:267-280`). If cancellation or no-show timestamps are needed for reporting, define separate event fields/requirements rather than reusing `completedAt`.

### 6.2 Repeated transitions, legacy records, and atomicity

Before a Staff UI is built around status actions:

1. Replace blind `updateDoc()` status writes with an atomic transaction that reads the queue document, checks that it exists, validates the current-to-next transition, and writes the new status plus `updatedAt`.
2. In that same successful transaction, set the matching lifecycle field to `serverTimestamp()` only if this is the first accepted transition into that state and the field is absent/null. Never overwrite an existing event timestamp on a repeated click/retry.
3. For an identical already-applied request, return an explicit idempotent result without changing the event timestamp; for a disallowed transition, surface a clear error and do not mutate the local store.
4. Keep `additionalFields` restricted to explicitly permitted operational fields (for example, `room` only when the workflow supports it); do not let a caller override `status`, event timestamps, identifiers, or `updatedAt`.
5. For pre-existing records lacking timestamps, do not infer historical event time from current `updatedAt` and do not backdate from `createdAt`. Keep the field unknown unless an explicitly approved data-repair process can establish the real event time. `CompletePage` currently falls back from `completedAt` to `updatedAt`/`createdAt` (`src/pages/patient/CompletePage.jsx:49-53`), so future UI should distinguish a missing true completion time rather than label a generic update time as completion.
6. Tighten Firestore rules in a separately approved implementation to mirror allowed transition and field-change constraints. Client transactions improve correctness but cannot replace rules enforcement.

### 6.3 Historical metrics enabled by timestamps

- Queue-entry wait to call: `calledAt - enteredAt` (actual waiting-to-call duration).
- Call-to-service-start delay: `consultationStartedAt - calledAt`.
- Service duration: `completedAt - consultationStartedAt`.
- Total time from joining to completion: `completedAt - enteredAt`.

All durations need validation for missing/invalid/out-of-order timestamps, and terminal outcomes such as `CANCELLED`/`NO_SHOW` must not be counted as completed consultations.

## 7. Staff Queue Management and Consultation Completion Plan

Complete the Staff operational workflow before Admin functionality:

1. **Define authorization context.** Decide where a Staff member's service assignment is stored and whether one staff user can work with one or multiple services. The existing profile/rules do not implement this. Resolve facility/service identity and active-state checks first.
2. **Add queue service operations**, not direct Firestore calls in page components:
   - subscribe/read service-specific waiting entries in FIFO order;
   - read/subscribe the active called/in-consultation entry;
   - perform validated, idempotent lifecycle transitions with timestamps;
   - query status-specific history where needed;
   - return explicit errors so the screen can show action failure, connectivity, loading, and empty states.
3. **Queue Management screen:** use Firestore as the source of truth and the existing FIFO helper/logic; display tickets, status, position and active ticket; enable Call only for the earliest eligible waiting item; prevent unrelated services from appearing; support the specified cancellation/no-show paths only if the approved screenshot/workflow includes them.
4. **Current Consultation screen:** show only supported queue data (ticket, service/facility, room if actually assigned, called/start times/status); transition a called item into consultation, then complete it. Do not add patient names or medical records.
5. **Integrate analytics-ready event capture** into each accepted transition. Use actual server event times rather than browser clock values or generic `updatedAt`.
6. **Test before Admin:** test simultaneous call attempts by two staff clients, invalid/repeated transitions, unauthorized cross-service reads/writes, Firestore failure feedback, and the full patient join → staff call → start → completion → patient completion flow.

`subscribeToServiceQueue()` and `updateQueueEntryStatus()` are existing integration points, not sufficient complete staff APIs as currently written: the former only returns `WAITING` entries, while the latter swallows errors and does not validate or timestamp transitions.

## 8. AI and Waiting-Time Readiness

### 8.1 What exists versus what is planned

- **Confirmed active logic:** `calculateQueuePosition()` (`src/utils/queue.js:40-105`) and `BASELINE_MINUTES_PER_PERSON = 7` (`src/constants/queueConstants.js:16-17`).
- **Confirmed absent:** no model loading/inference, generative prompt/API call, Firebase AI Logic SDK usage, AI provider SDK, prediction endpoint, backend function, or source writing/reading `predictions` collection was found in inspected `src/` or declared `package.json` dependencies.
- **Planned only:** `predictions/{predictionId}` schema in the Staff spec (`:596-610`) including `method`, `estimatedWaitMinutes`, `generatedAt`, `peopleAhead`, `queueLength`, `recentAverageServiceTime`, and `actualWaitMinutes`.
- The word “AI” appears in the patient spec in a design warning against an “AI-generated website” (`WaitWise_Patient_Website_Agent_Spec.md:376`); that is not an AI integration.
- **Unverified:** live Firebase-side functions, remote services, or integrations outside the repository cannot be ruled out from local source inspection. No such code is present in the reviewed project tree.

### 8.2 Data currently written versus data only documented

| Field/data | Source evidence | Status |
|---|---|---|
| `facilityId`, `serviceId`, `ticketCode`, `status` | `createQueueEntry()` writes these (`src/services/queueService.js:194-204`) | Written on normal Firestore create |
| `enteredAt`, `createdAt`, `updatedAt` | server timestamps in normal create (`:194-204`) | Written on normal Firestore create |
| `updatedAt` on status update | `updateQueueEntryStatus()` (`:277-281`) | Written if Firestore update succeeds |
| `calledAt`, `consultationStartedAt` | Spec fields only; no source writer found | Not captured by app |
| `completedAt` | Read by `CompletePage`; dev preview field exists in `src/constants/devDemoState.js` | Not written by production status operation |
| Staffing, room assignment history, prediction values, actual duration aggregates | No production writer/reader found | Not established in app |

The `memoryQueueStore` fallback's client ISO times (`src/services/queueService.js:206-219`, `:235-248`) are not server-verified historical events and must never be mixed silently into a training/measurement dataset.

### 8.3 Practical staged path

1. **Keep the existing deterministic baseline** as a transparent comparison. Make sure the UI presents it as approximate and not a promise.
2. **Capture complete, validated lifecycle events** using server timestamps, after the Staff transition contract and rules are agreed. Preserve outcome and service/facility dimensions; avoid collecting patient identity or clinical data for queue analytics.
3. **Establish descriptive statistics before prediction:** per service/facility, compute sample count, median and percentile distributions for join-to-call and service duration; segment by staffing/capacity or time window only when those facts are reliably recorded and privacy-approved.
4. **Evaluate a transparent statistical estimator** (for example, rolling median service duration multiplied by eligible work ahead, adjusted for active work/capacity when measured). Compare to the fixed 7-minute baseline on a time-separated holdout period; report MAE/median absolute error and sample size, and monitor missing/outlier data.
5. **Consider ML only after the dataset is sufficiently representative and stable.** Use a documented validation split and compare against the statistical baseline; avoid an arbitrary record-count promise because adequacy depends on variation, service mix, and data quality. Deploy inference server-side if it requires privileged data/credentials.
6. Keep any estimate advisory. It must not change clinical triage, queue priority, emergency handling, or staff decisions. Apply data minimization, access control, retention, and aggregation before exposing analytics.

## 9. Recommended Priorities

### Priority 1 — Before implementing operational Staff actions

1. **Resolve service assignment and isolation.** Specify a trusted `serviceId` (or equivalent assignment model) and enforce it in rules and query design; also define facility scoping. Current Staff role grants broad queue access.
2. **Make queue writes truthful.** Remove success-shaped volatile ticket fallback for production queue entry; surface failures and prevent ticket creation while offline, per patient spec.
3. **Define and enforce status transitions.** Adopt the allowed state graph and server timestamp mapping in Section 6; update Firestore rules to constrain transitions and mutable fields in an authorized change.
4. **Propagate read/write/listener errors.** A failed staff action must not resolve normally or display success; callers must handle asynchronous and setup errors.

### Priority 2 — Complete and test Staff operation before Admin

1. Implement service-scoped Queue Management with real-time waiting list and active ticket.
2. Implement Current Consultation with explicit start and completion actions and timestamp capture.
3. Follow with Dashboard, History, then Settings, matching the staff spec's screen plan. History should expose only fields supported by real data; do not fabricate event times.
4. Add audit logging for operational actions only after defining actor/action schema and secure write ownership; the current client code does not write `auditLogs`.
5. Run cross-role Firestore rule tests and multi-client concurrency tests; verify the deployed rules match the tested source rules.

### Priority 3 — Analytics and possible AI

1. Build aggregate historical metrics from validated server-side lifecycle events.
2. Compare rolling descriptive estimates with the seven-minute deterministic baseline and publish quality/sample-size information.
3. Consider ML only if measured baseline errors and data quantity/quality justify it; keep predictions non-clinical and advisory.

## 10. Validation Status and Remaining Unknowns

- This task was a source/spec inspection and report creation; no build, lint, emulator, live Firebase, or browser tests were run.
- `package.json` provides `dev`, `build`, `lint`, and `preview`; no test script is declared in the reviewed manifest.
- **Unverified:** deployed Firestore rules, real collections/indexes/records, enabled Auth providers, Cloud Functions or external services not represented in the repo, current queue volume, and whether timestamp fields exist in production data.
- Before implementation, confirm: (1) how staff service assignment is represented, (2) whether the project will remain client-only or introduce trusted backend functions, (3) the desired local-date policy for daily ticket counters, and (4) whether legacy records can be queried/exported for a quality baseline.

