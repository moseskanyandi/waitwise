# WaitWise — Complete Project Handoff & Remaining Implementation Specification

## Purpose

This file is the handoff/source-of-truth for continuing **WaitWise: Real-Time Smart Queue Tracking and Management System** with another AI coding agent.

If the original chat runs out of tokens, upload this file to the next agent and instruct it:

> Read `WAITWISE_REMAINING_WORK_HANDOFF.md` completely before changing the project. Treat it as the project handoff/specification. Inspect the actual repository and current code before making changes. Do not invent missing requirements.

The project is a university mini project. Keep it practical, lightweight, understandable, testable, and appropriate for the Firebase free plan.

---

# 1. PROJECT IDENTITY

**Project:** WaitWise: Real-Time Smart Queue Tracking and Management System

**Institution:** DMI–St. Eugene University  
**Programme:** Bachelor of Science in Computer Science  
**Department:** BSc-CS  
**Year:** 3rd Year  
**Semester:** Semester VI  
**Academic Year:** 2026  
**Supervisor:** Ms. Foster

Academic statement:

> A Mini Project Submitted to DMI–St. Eugene University in Partial Fulfilment of the Requirements for the Bachelor of Science in Computer Science.

Context:
- Healthcare queue-management system.
- Initial target context: a Lusaka government clinic/health facility.
- Patient-facing website for joining and tracking a queue.
- Staff-facing queue management.
- Admin management.
- Baseline waiting-time estimation first.
- ML prediction only after sufficient/evaluated data.
- React + JavaScript + Vite + Firebase/Firestore.
- Firebase free plan is a firm constraint.

---

# 2. NON-NEGOTIABLE CONSTRAINTS

## Technology

Current stack:
- React
- JavaScript
- Vite
- Firebase
- Firestore
- Firebase Authentication for staff/admin
- Python only for later prediction/ML work

Do NOT replace the stack with Flask, SQLite, Django, Express, etc.

## Firebase free plan

Avoid:
- unnecessary reads/writes
- unnecessary listeners
- SMS
- push notification infrastructure
- complex backend services
- full offline synchronization
- unnecessary cloud functions
- over-engineering

## Authentication

Patients do **not** create accounts.

Staff/admin use Firebase Authentication with email/password.

## Patient check-in

Support:
1. QR-code self-service check-in.
2. Staff-assisted check-in as fallback/accessibility.

## Source of truth

Firestore/server state is authoritative.

localStorage/sessionStorage are convenience/recovery only.

## Queue ordering

FIFO is the default.

Authorized staff may apply facility priority/triage where requirements allow it.

Do not invent a new queue-priority algorithm.

## Queue lifecycle

Primary:

WAITING → CALLED → IN_CONSULTATION → COMPLETED

Other supported transitions:
- WAITING → CANCELLED
- CALLED → NO_SHOW
- CALLED → CANCELLED where appropriate

## Queue states

- OPEN
- PAUSED
- CLOSED
- NOT_YET_OPEN

---

# 3. CURRENT STATUS

Patient screens 1–8 are implemented.

Routes:
- `/join`
- `/confirm`
- `/ticket`
- `/track`
- `/almost-next`
- `/called`
- `/complete`

Patient flow:

Home → Join Queue → Confirm → Ticket → Track → Almost Next → Called → Complete

Latest implementation report:
- Screens 6–8 implemented.
- Realtime progression implemented.
- Ticket/state recovery implemented.
- Lifecycle tests A–E executed.
- `npm run build` passed.
- Latest build: 66 modules, 0 errors.

IMPORTANT CURRENT ISSUE:

The lifecycle test produced repeated:

`PERMISSION_DENIED: Missing or insufficient permissions.`

The test script used fallback/safe client behavior, so reported test success does NOT prove Firestore permissions are correct.

Fix the actual permissions/rules before considering backend testing complete. Do not suppress errors or make Firestore completely public.

---

# 4. PATIENT UI — COMPLETED

Reference directory:

`design-reference/DESIGNS/`

Files:
- `screen-1-home.jpg`
- `screen-2-join-queue.jpg`
- `screen-3-confirm.jpg`
- `screen-4-ticket.jpg`
- `screen-5-track.jpg`
- `screen-6-almost-next.jpg`
- `screen-7-called.jpg`
- `screen-8-complete.jpg`

Other assets:
- `design-reference/DESIGNS/waitwise-logo.jpg`
- `design-reference/DESIGNS/hero-image.jpg`
- `design-reference/DESIGNS/hero-image 2`

These references are the visual source of truth.

Existing visual direction:
- healthcare-focused
- professional
- trustworthy
- simple
- patient-friendly
- deep healthcare green
- not a generic SaaS/AI sales page

Palette:
- Primary green: `#0a5c53`
- Dark/hover green: `#05443d`
- Title: `#09223a`
- Body: `#334155`

Do not redesign Screens 1–5 unnecessarily.

## Screen 6 — Almost Next

`src/pages/patient/AlmostNextPage.jsx`

Includes:
- dynamic position
- people ahead
- estimated wait
- progress timeline
- "What to do now?" ringing-phone notice
- "Your queue details"
- "Helpful tips"

## Screen 7 — Called

`src/pages/patient/CalledPage.jsx`

Includes:
- radiant megaphone burst badge
- "IT'S YOUR TURN!" eyebrow
- dynamic destination
- ticket callout
- Service / Facility / Room details
- queue-safety reassurance
- Quick details
- Helpful tips

Room information must come from actual data where available. Do not fabricate it merely to fill the UI.

## Screen 8 — Complete

`src/pages/patient/CompletePage.jsx`

Includes:
- checkmark radiant burst badge
- completion message
- physical ticket cutout
- Service / Facility / Room / Completed details
- feedback area
- Visit Summary
- formatted completion timestamp
- Take Care card

---

# 5. CURRENT PROJECT STRUCTURE

Project root:

`C:\Users\MOSES KANYANDI\Desktop\waitwise`

Expected structure:

```text
waitwise/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── patient/
│   │   ├── staff/
│   │   └── admin/
│   ├── pages/
│   │   ├── patient/
│   │   ├── staff/
│   │   └── admin/
│   ├── services/
│   │   └── firebase/
│   ├── hooks/
│   ├── utils/
│   ├── routes/
│   ├── styles/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── prediction/
├── firestore.rules
├── firestore.indexes.json
├── .env
├── package.json
├── README.md
└── WaitWise_Patient_Website_Agent_Spec.md
```

Important existing files:
- `src/constants/queueConstants.js`
- `src/constants/patientContent.js`
- `src/utils/storage.js`
- `src/utils/queue.js`
- `src/services/queueService.js`
- `src/components/common/Icons.jsx`
- `src/styles/patient.css`

Patient components include:
- `StepProgress.jsx`
- `TicketCard.jsx`
- `QueueProgressDots.jsx`
- `QuickInfoCard.jsx`
- `HelpfulTipsCard.jsx`
- `VisitSummaryCard.jsx`
- `TakeCareCard.jsx`

---

# 6. FIREBASE PROJECT

Firebase project:
**WaitWise**

Project ID:
`waitwise-47dcd`

Web app:
**WaitWise Web**

Firestore location:
United States

Plan:
Firebase free plan.

---

# 7. FIRESTORE DATA MODEL

Collections:

```text
users
facilities
services
queueEntries
predictions
auditLogs
counters
```

## users/{uid}

```text
name
email
role
facilityId
active
createdAt
```

Roles:
- STAFF
- ADMIN

## facilities/{facilityId}

```text
name
location
active
```

Known facility:

`facilities/main-health-centre`

```text
name: Main Health Centre
location: Lusaka
active: true
```

Do NOT fabricate a street address.

## services/{serviceId}

```text
facilityId
name
code
active
capacity
```

Current services:

`general-consultation`
- General Consultation
- A
- active true
- capacity 1

`laboratory`
- Laboratory
- B
- active true
- capacity 1

`pharmacy`
- Pharmacy
- C
- active true
- capacity 1

`imaging`
- Imaging
- D
- active true
- capacity 1

## queueEntries/{entryId}

```text
ticketCode
facilityId
serviceId
status
enteredAt
calledAt
consultationStartedAt
completedAt
entryMethod
createdAt
updatedAt
```

Possible operational field:
`room`

Do NOT permanently store `queuePosition`.

## predictions/{predictionId}

```text
queueEntryId
method
estimatedWaitMinutes
generatedAt
peopleAhead
queueLength
recentAverageServiceTime
actualWaitMinutes
```

Methods:
- `baseline_v1`
- `ml_v1`

## auditLogs/{logId}

```text
actorId
action
queueEntryId
previousValue
newValue
reason
createdAt
```

## counters/{counterId}

```text
facilityId
serviceId
date
nextNumber
```

---

# 8. QUEUE LOGIC

Existing utility:

`calculateQueuePosition()`

Expected behavior:
1. consider active WAITING entries;
2. parse timestamps safely;
3. sort FIFO;
4. find patient;
5. calculate:
   - `currentPosition`
   - `peopleAhead`

Do not create a competing implementation.

No permanent queuePosition field.

Example:

```text
A WAITING
B WAITING
C WAITING
D WAITING

D = 4th
peopleAhead = 3
```

When entries ahead leave WAITING appropriately, D's position updates dynamically.

Screen 6 currently uses:

```text
position <= 2 || peopleAhead <= 1
```

Do not change casually.

---

# 9. TICKET GENERATION

Ticket numbering is sequential and visit-order based.

Counter is per:
- facility
- service
- date

Example:
`A001`, `A002`, `A003`

Use the existing transaction/server-safe implementation.

Do not replace it with arbitrary random ticket generation.

---

# 10. PATIENT STORAGE / RECOVERY

Patients have no accounts.

Use:
- sessionStorage for temporary selected-service flow
- localStorage for active-ticket recovery

Existing helper:
`getActiveTicket()`

Browser storage is not authoritative.

Firestore is authoritative.

---

# 11. REALTIME BEHAVIOR

Existing listeners:
- `subscribeToQueueEntry()`
- `subscribeToServiceQueue()`

No manual refresh should be required.

Queue changes should update:
- position
- people ahead
- estimate

Track page can automatically progress to:
- Screen 6
- Screen 7
- Screen 8

based on actual state.

---

# 12. CURRENT FIRESTORE PERMISSION PROBLEM — FIRST PRIORITY

Latest test command:

```powershell
node .\scratch\test_screens_6_to_8.mjs
```

Produced errors such as:

```text
PERMISSION_DENIED: Missing or insufficient permissions.
```

Affected:
- service queue fetch
- queue-entry creation transaction
- queue status updates
- queue-entry subscription

The script then used safe fallback behavior.

Next agent must inspect:
- `firestore.rules`
- `src/services/queueService.js`
- Firebase initialization
- authentication state
- patient read/write/listener paths

Fix the legitimate permission model.

Do NOT:
- make all Firestore public
- remove security rules
- hide errors
- require patient login unless explicitly required
- weaken staff/admin security

Patients are unauthenticated, so the rules need a practical secure model for the legitimate patient workflow.

After fixing:

```powershell
node .\scratch\test_screens_6_to_8.mjs
npm run build
```

Permission-denied errors should be gone for legitimate operations.

---

# 13. STAFF SIDE — REMAINING WORK

Main remaining feature after patient screens: Staff dashboard/queue operations.

Staff uses Firebase Auth email/password.

No public staff signup.

Staff must be protected by authentication and authorization.

Staff should only access authorized facility/service data.

## Staff capabilities

### Authentication
- login
- logout
- protected routes
- auth-state handling
- unauthorized redirect

### Staff identity
Display relevant:
- name
- role
- facility

### Service selection
Allow authorized staff to work with relevant services.

Current:
- General Consultation
- Laboratory
- Pharmacy
- Imaging

### Queue overview
Display:
- current queue
- waiting patients
- current patient
- called patient
- queue state
- basic counts
- service

Use realtime data where useful, but avoid unnecessary listeners.

---

# 14. STAFF QUEUE OPERATIONS

Staff must be able to:

## Call next

Move eligible:

`WAITING → CALLED`

Set:
`calledAt`

Set room/destination if actual data is available.

## Start consultation

`CALLED → IN_CONSULTATION`

Set:
`consultationStartedAt`

## Complete consultation

`IN_CONSULTATION → COMPLETED`

Set:
`completedAt`

## Cancel

Allow authorized cancellation where requirements allow.

## No-show

`CALLED → NO_SHOW`

Use the previously discussed 5-minute grace-period concept.

Do not build a complex timer service.

## Pause/resume

Support:
- OPEN
- PAUSED
- CLOSED
- NOT_YET_OPEN

Keep it simple.

---

# 15. STAFF QUEUE RULES

Default FIFO.

Staff should not arbitrarily reorder patients.

If facility priority/triage is needed, authorized staff can apply it according to requirements.

Do not permanently store queue position.

Important corrections should be audit-friendly.

---

# 16. STAFF REALTIME

Update when:
- patient joins
- patient is called
- consultation starts
- consultation completes
- patient cancels
- patient becomes no-show
- queue state changes

Keep listeners narrow to control Firebase usage.

---

# 17. STAFF UI

Keep it practical.

Suggested areas:
1. header/user
2. service/queue selector
3. queue status
4. current patient
5. waiting queue
6. next action
7. patient status controls
8. basic statistics

Do not create an enterprise-scale dashboard.

Use WaitWise's existing visual language.

---

# 18. ADMIN SIDE — REMAINING WORK

Admin is for system/facility management.

## Facilities
- view facilities
- activate/deactivate
- edit facility information where required

## Services
- view
- create/edit where required
- activate/deactivate
- set capacity

## Staff/users
- create/manage staff accounts where appropriate
- assign role
- assign facility
- activate/deactivate

No public staff signup.

## Audit logs
Review:
- actor
- action
- queue entry
- previous value
- new value
- reason
- timestamp

Keep it lightweight.

---

# 19. SECURITY

Security must be enforced by Firestore rules, not only UI.

## Patients

Only legitimate patient workflow access.

Do not allow:
- arbitrary users collection access
- audit log access
- arbitrary queue-entry modification
- staff/admin data access

## Staff

Authenticated staff:
- only authorized facility
- only authorized service operations

## Admin

Authorized admin:
- broader management permissions

Do not trust a role supplied directly by the browser.

---

# 20. CUSTOM CLAIMS

Previously discussed:

Roles:
- `STAFF`
- `ADMIN`

Claims must be assigned securely.

Do not build an insecure client-side role/claim editor.

If the existing architecture already has custom claims, preserve it.

If not, inspect current code before adding anything.

---

# 21. AUDIT LOGGING

Important corrections should record:

```text
actorId
action
queueEntryId
previousValue
newValue
reason
createdAt
```

Examples:
- status correction
- no-show
- queue correction
- service change
- staff account change

Keep it lightweight.

---

# 22. WAITING-TIME BASELINE

Baseline first. ML later.

Baseline inputs:
- peopleAhead
- recentAverageServiceTime
- queueLength
- capacity/current workload

Estimate is an estimate, not a promise.

Current patient UI may display a rounded range such as:

`5–15 minutes`

Do not claim exact prediction.

---

# 23. ACTUAL WAIT AND SERVICE TIME

Actual wait:

```text
actualWaitMinutes =
consultationStartedAt - enteredAt
```

Service time:

```text
serviceMinutes =
completedAt - consultationStartedAt
```

Only calculate when timestamps are valid.

---

# 24. PREDICTION DATA

Use `predictions/{predictionId}`:

```text
queueEntryId
method
estimatedWaitMinutes
generatedAt
peopleAhead
queueLength
recentAverageServiceTime
actualWaitMinutes
```

Methods:
- `baseline_v1`
- `ml_v1`

Do not write prediction records on every render.

Keep Firebase usage reasonable.

---

# 25. ML / PYTHON — LATER

Only after baseline and sufficient data.

Folder:
`prediction/`

Workflow:
1. export Firestore data using Firebase Admin SDK;
2. validate data;
3. build dataset;
4. train regression model;
5. evaluate;
6. compare against baseline;
7. integrate ML only if evaluation supports it.

Features:
- peopleAhead
- queueLength
- recentAverageServiceTime
- availableCapacity
- hourOfDay
- dayOfWeek

Target:
`actualWaitMinutes`

Preferred split:
chronological, not random, to avoid temporal leakage.

Metrics:
- MAE
- RMSE

Do not claim ML is better unless actual evaluation shows it.

---

# 26. SIMULATED DATA

If insufficient real history exists, simulated data may be used only if clearly documented as simulated.

Do not present simulated clinic results as real.

Document assumptions.

---

# 27. CONNECTION / OFFLINE FALLBACK

No full offline synchronization.

Connection banner example:

> Connection lost — showing your last update. Your ticket remains active.

Show last known ticket/queue state where appropriate.

Manual/paper fallback exists for facility operations.

Do not build SMS/push infrastructure.

---

# 28. QR CHECK-IN

Patient:
1. scans facility QR;
2. enters/selects service as appropriate;
3. confirms;
4. joins queue.

Staff-assisted fallback is available.

No patient account required.

---

# 29. PATIENT LEAVES / PHONE OFF

If patient leaves browser after joining:
- server-side queue entry remains active;
- browser storage helps recovery;
- reopening should recover active ticket where supported;
- do not create duplicates simply because of refresh/reopen.

Phone-off does not automatically cancel the ticket.

Called patients are subject to the grace-period process.

---

# 30. 5-MINUTE GRACE PERIOD

Previously agreed:

Approximately 5 minutes after CALLED for the patient to present.

Use timestamp-based logic.

Avoid background timers and complex scheduling.

After expiry, staff can mark NO_SHOW.

---

# 31. FIREBASE FREE-PLAN OPTIMIZATION

Avoid:
- continuous polling
- duplicate listeners
- writes for every UI render
- permanent queuePosition writes
- prediction writes on every refresh
- duplicated data without reason

Prefer:
- narrow realtime listeners
- derived position
- small documents
- event-based writes
- only required queries

---

# 32. FIRESTORE INDEXES

Inspect:

`firestore.indexes.json`

Add indexes only when a real query requires them.

Test queries after changes.

Do not create unnecessary indexes.

---

# 33. SECURITY-RULE TESTING

Test:

### Patient
Can:
- perform legitimate queue workflow
- read necessary queue state

Cannot:
- read arbitrary users
- read audit logs
- modify arbitrary queue entries
- modify staff/admin data

### Staff
Can:
- operate within authorized facility/service

Cannot:
- access unrelated facility data
- alter protected admin data

### Admin
Can:
- perform authorized management

Never use:

```text
allow read, write: if true
```

as the final security model.

---

# 34. TESTING PLAN

## Patient
- service loading
- service selection
- confirmation
- ticket creation
- recovery
- queue position
- people ahead
- estimate
- realtime
- Almost Next
- Called
- Complete

## Staff
- login
- protected route
- queue loading
- call next
- consultation
- complete
- cancel
- no-show
- pause/resume
- realtime

## Admin
- protected access
- staff management
- service management
- facility management
- audit logs

## Security
- unauthorized access
- wrong role
- wrong facility
- patient boundaries

## Build

```powershell
npm run build
```

Only report success if it actually passes.

---

# 35. CURRENT PATIENT TEST SCRIPT

File:

`scratch/test_screens_6_to_8.mjs`

Run:

```powershell
node .\scratch\test_screens_6_to_8.mjs
```

It tests:
- WAITING queue
- Almost Next
- CALLED
- COMPLETED
- recovery

Current permission errors must be resolved first.

---

# 36. SEPARATION OF CONCERNS

UI components:
presentation.

Pages:
page composition/state coordination.

Services:
Firebase/database operations.

Hooks:
reusable state/subscription behavior.

Utils:
pure calculations/helpers.

Constants:
hardcoded content/configuration.

Styles:
CSS only.

Do not put Firestore queries directly into every UI component.

Do not create giant components when reusable logic already exists.

---

# 37. PROJECT GOVERNANCE / REQUIREMENTS TRACEABILITY

Earlier project rule:

- requirements checklist IDs: `R1–R24` and `X1–X13`
- decisions recorded in `docs/decisions-log.md`
- one-line reason for decisions
- optional items untouched unless approved
- methodology-affecting decisions require project-owner approval
- status:
  `planned → implemented → tested`
  only after actual implementation/testing
- open-ended requirements should be flagged rather than assumed

Do not silently make methodology-affecting decisions.

If a decision is needed:
1. inspect current docs/spec;
2. inspect existing code;
3. record it in the decision log when appropriate;
4. do not invent a requirement.

---

# 38. EXISTING PATIENT AGENT SPEC

Existing file:

`WaitWise_Patient_Website_Agent_Spec.md`

Read it before changing patient functionality.

It contains detailed patient-side visual/implementation instructions.

Do not replace it unnecessarily.

This handoff document covers the whole project and remaining work.

---

# 39. RECOMMENDED IMPLEMENTATION ORDER

## Phase 1 — Fix Firestore permissions

Inspect:
- `firestore.rules`
- `queueService.js`
- Firebase initialization/auth

Fix legitimate access.

Run:

```powershell
node .\scratch\test_screens_6_to_8.mjs
npm run build
```

## Phase 2 — Staff authentication

Implement/verify:
- Firebase Auth
- login
- protected routes
- role/facility authorization

## Phase 3 — Staff queue dashboard

Implement:
- service selection
- queue overview
- call next
- called
- start consultation
- complete
- cancel
- no-show
- queue state controls

## Phase 4 — Staff realtime

Verify realtime updates.

## Phase 5 — Audit logging

Implement lightweight audit records.

## Phase 6 — Admin

Implement:
- staff
- services
- facilities
- activation/deactivation
- audit log view

## Phase 7 — Baseline prediction

Implement/test:
- baseline_v1
- estimate
- actual wait
- prediction data

## Phase 8 — ML

Only after enough data/evaluation:
- export
- preprocessing
- chronological split
- regression
- MAE
- RMSE
- baseline comparison

## Phase 9 — Security testing

Test rules and role/facility boundaries.

## Phase 10 — Full lifecycle testing

Test:

PATIENT JOINS
→ WAITING
→ ALMOST NEXT
→ CALLED
→ IN_CONSULTATION
→ COMPLETED

Also:
- CANCELLED
- NO_SHOW

## Phase 11 — Academic documentation

Update:
- implementation chapter
- testing chapter
- screenshots
- database design
- architecture
- methodology
- prediction/ML section
- limitations
- conclusion

Never claim an unimplemented feature is implemented.

---

# 40. FINAL ACCEPTANCE CHECKLIST

## Patient
- [ ] Home
- [ ] Join Queue
- [ ] Confirm
- [ ] Ticket
- [ ] Track
- [ ] Almost Next
- [ ] Called
- [ ] Complete
- [ ] realtime
- [ ] recovery
- [ ] connection-loss message
- [ ] QR flow
- [ ] staff-assisted fallback

## Queue
- [ ] FIFO
- [ ] dynamic position
- [ ] people ahead
- [ ] ticket counter
- [ ] queue states
- [ ] called
- [ ] consultation
- [ ] completed
- [ ] cancelled
- [ ] no-show
- [ ] grace period

## Staff
- [ ] authentication
- [ ] authorization
- [ ] protected routes
- [ ] dashboard
- [ ] call next
- [ ] consultation
- [ ] complete
- [ ] cancel
- [ ] no-show
- [ ] pause/resume
- [ ] realtime

## Admin
- [ ] authentication
- [ ] authorization
- [ ] facilities
- [ ] services
- [ ] staff
- [ ] audit logs

## Prediction
- [ ] baseline_v1
- [ ] actual wait
- [ ] prediction records
- [ ] evaluation
- [ ] ML only if enough data
- [ ] chronological split
- [ ] MAE
- [ ] RMSE
- [ ] baseline comparison

## Security
- [ ] Firestore rules
- [ ] patient boundaries
- [ ] staff boundaries
- [ ] admin boundaries
- [ ] facility boundaries
- [ ] audit protection

## Testing
- [ ] lifecycle
- [ ] realtime
- [ ] authentication
- [ ] security rules
- [ ] patient flow
- [ ] staff flow
- [ ] admin flow
- [ ] responsive UI
- [ ] build

## Build

```powershell
npm run build
```

Must pass with zero errors.

---

# 41. MOST IMPORTANT HANDOFF INSTRUCTION

The next AI agent must NOT start by rewriting the project.

It must:

1. Read this entire file.
2. Read `WaitWise_Patient_Website_Agent_Spec.md`.
3. Inspect the actual repository.
4. Inspect the current implementation.
5. Identify what is already implemented.
6. Fix the current Firestore permission problem first.
7. Continue the remaining work from the current state.
8. Preserve the patient screens unless a genuine bug requires a minimal fix.
9. Keep Firebase free-plan constraints.
10. Test every implemented feature.
11. Run `npm run build`.
12. Report exactly what changed and what was actually tested.

The goal is to continue the existing WaitWise project, not start a new project.

END OF HANDOFF DOCUMENT.
