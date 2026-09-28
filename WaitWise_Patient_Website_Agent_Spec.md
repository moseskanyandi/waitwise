# WaitWise Patient Website --- Agent Implementation Specification

## Purpose

You are working directly inside my existing React + Vite project called
**WaitWise**.

WaitWise is a healthcare queue-management website called:

**WaitWise: Real-Time Smart Queue Tracking and Management System**

This document is the implementation reference for the patient-facing
website.

The eight supplied reference screenshots are the **visual source of
truth** for the approved patient screens.

------------------------------------------------------------------------

## 1. Inspect the Existing Project First

Before making ANY changes:

1.  Inspect the existing project structure.
2.  Inspect `package.json`.
3.  Inspect `App.jsx`, `main.jsx`, and `index.css`.
4.  Inspect all existing routing files.
5.  Inspect the existing Firebase configuration.
6.  Inspect `src/services/queueService.js`.
7.  Inspect any existing patient pages/components.
8.  Inspect existing hooks, utilities, constants, and styles.
9.  Inspect the design-reference folder and all eight screenshots.
10. Understand what is already implemented.
11. Identify exactly what needs to be added or modified.

Do NOT restart the project.

Do NOT immediately rewrite existing files.

Do NOT replace working code simply because you would structure it
differently.

Reuse existing working functionality.

Before implementation, briefly report: - what already exists - what
needs to be added - which files you will create - which files you will
modify

Then implement the work.

------------------------------------------------------------------------

## 2. Visual Source of Truth

The approved screenshots are stored in the project at:

```text
design-reference/
└── DESIGNS/
    ├── screen-1-home.jpg
    ├── screen-2-join-queue.jpg
    ├── screen-3-confirm.jpg
    ├── screen-4-ticket.jpg
    ├── screen-5-track.jpg
    ├── screen-6-almost-next.jpg
    ├── screen-7-called.jpg
    └── screen-8-complete.jpg
```

These eight screenshots are the **PRIMARY VISUAL SOURCE OF TRUTH**.

When implementing each screen, inspect its corresponding image directly.

Mapping:

```text
Screen 1 → design-reference/DESIGNS/screen-1-home.jpg
Screen 2 → design-reference/DESIGNS/screen-2-join-queue.jpg
Screen 3 → design-reference/DESIGNS/screen-3-confirm.jpg
Screen 4 → design-reference/DESIGNS/screen-4-ticket.jpg
Screen 5 → design-reference/DESIGNS/screen-5-track.jpg
Screen 6 → design-reference/DESIGNS/screen-6-almost-next.jpg
Screen 7 → design-reference/DESIGNS/screen-7-called.jpg
Screen 8 → design-reference/DESIGNS/screen-8-complete.jpg
```

Treat the screenshots as the **PRIMARY VISUAL SOURCE OF TRUTH**.

Do NOT redesign them. Do NOT reinterpret them. Do NOT create a different
design based only on descriptions such as "modern", "minimal", or
"healthcare".

Reproduce the screenshots as closely as reasonably possible.

Match: - overall page structure - header and logo placement -
navigation - typography hierarchy - font sizes and weights - colors -
spacing, padding, and margins - card sizes and positions - rounded
corners and borders - icons and icon placement - buttons - information
hierarchy - two-column layouts - progress indicators - side panels -
footer areas - informational cards - backgrounds - decorative elements -
visual proportions - responsive behavior

The screenshots are not merely inspiration. They are the intended UI.

Do not add visual effects that are not present in the screenshots.

Do not add: - glassmorphism - excessive gradients - glowing effects -
futuristic effects - unnecessary animations - generic SaaS styling -
restaurant/waitlist styling - marketing-page styling

The final website should visually resemble the supplied screenshots.

------------------------------------------------------------------------

## 3. Approved Patient Screens

### Screen 1 --- Home / Welcome

Reference:

```text
design-reference/DESIGNS/screen-1-home.jpg
```

Main heading:

**Quality care, made simpler.**

Supporting message explains that patients can get a ticket, join the
right queue, and spend less time waiting.

Primary actions:

**Join a Queue** Get a ticket for the service you need.

**Track My Queue** Already have a ticket? Check your position and wait
time.

Informational sections: - Less waiting time - Secure & private - Better
access to care - For a healthier community

Bottom message:

**Your health matters.** We're here to help.

Reproduce reference screenshot 1.

### Screen 2 --- Join a Queue / Select Service

Reference:

```text
design-reference/DESIGNS/screen-2-join-queue.jpg
```

Heading:

**Select the service you need.**

Supporting text:

Choose the type of service and we'll guide you through the next steps.

Services: - General Consultation - Laboratory - Pharmacy - Imaging /
X-ray

These services must come from Firestore. Do NOT hard-code the actual
service data in the page component. Use the existing `getServices()`
functionality.

Bottom information section:

**Need help?** Our staff are here to assist you. Visit reception or ask
at the information desk.

Reproduce reference screenshot 2.

### Screen 3 --- Confirm & Join Queue

Reference:

```text
design-reference/DESIGNS/screen-3-confirm.jpg
```

Heading:

**You're almost there!**

Contains: - Back to Services - progress indicator - Select Service -
Confirm Details - Join Queue

Selected service information includes: - service name - facility /
clinic - facility address - estimated wait time

Right-side Queue Summary: - Service - Facility - Estimated wait time

Primary button:

**Join Queue →**

Important information: - A ticket will be generated - Keep your ticket
number - Stay reachable - Your place is secure

Reproduce reference screenshot 3.

### Screen 4 --- YOU'RE ALL SET!

Reference:

```text
design-reference/DESIGNS/screen-4-ticket.jpg
```

Approved wording:

**YOU'RE ALL SET!**

**Your place is saved.**

The patient successfully joined the queue.

Ticket card:

**YOUR TICKET NUMBER**

**A106**

General Consultation Main Health Centre

A106 is an example only. The real ticket MUST come from Firestore.

Status information: - Your current position --- 4th in line - 3 people
ahead of you - Estimated wait time --- 15--30 minutes - Last updated ---
Just now

Right-side Quick Information panel.

Track My Queue action.

Bottom message:

**Thank you for choosing WaitWise.** We're here to make your visit
easier, faster and more comfortable.

Important: - "YOU'RE ALL SET!" should be black/dark. - "Your place is
saved." should be green.

Reproduce reference screenshot 4.

### Screen 5 --- Track My Queue

Reference:

```text
design-reference/DESIGNS/screen-5-track.jpg
```

Heading:

**Here's your current status**

Explain that WaitWise is monitoring the patient's place and will notify
them when their turn is near.

Show: - actual ticket - queue progress visualization - current
position - people ahead - estimated wait

Right-side Queue Details: - Service - Facility - Ticket number - Current
position - People ahead - Estimated wait time

Helpful tips.

Lower section:

**What happens next?** We'll keep updating your position in real time.

Reproduce reference screenshot 5.

### Screen 6 --- You're Almost Next

Reference:

```text
design-reference/DESIGNS/screen-6-almost-next.jpg
```

Heading:

**You're almost next!**

Supporting message:

Just 1 person ahead of you. You're doing great --- your turn is coming
soon!

Example: - 2nd in line - 1 person ahead - Estimated wait: 5--15 minutes

Keep the same information panel and Helpful Tips style as screen 5.

Lower card:

**What to do now?** Please keep your phone nearby and be ready to
respond.

Reproduce reference screenshot 6.

### Screen 7 --- It's Your Turn

Reference:

```text
design-reference/DESIGNS/screen-7-called.jpg
```

Heading:

**IT'S YOUR TURN!**

Main message:

**Please proceed to General Consultation --- Room 3.**

The ticket number is shown.

IMPORTANT: Once CALLED, do NOT keep presenting "2nd in line" or another
waiting position as the main status.

Show: - Service --- General Consultation - Facility --- Main Health
Centre - Room --- Room 3

Keep the ticket card.

Explain that staff will be ready to see the patient.

Reproduce reference screenshot 7.

### Screen 8 --- Visit Complete

Reference:

```text
design-reference/DESIGNS/screen-8-complete.jpg
```

Heading:

**Thank you for using WaitWise!**

Supporting text:

Your consultation has been completed. We hope you feel better soon.

Show: - ticket - service - facility - room - status --- Completed - date
& time

Feedback section:

**How was your experience?**

with a feedback action.

Reproduce reference screenshot 8.

------------------------------------------------------------------------

## 4. Design System

The screenshots establish the design system.

Use the same design consistently: - healthcare-focused - clean - calm -
professional - trustworthy - light - spacious - blue/teal healthcare
palette - soft supporting colors - rounded cards - subtle borders -
clear typography - restrained decoration

Do NOT make it look like a generic AI-generated website.

Do NOT substitute the design with another "modern healthcare" design.

------------------------------------------------------------------------

## 5. Existing Technology

Stack: - React - Vite - JavaScript - React Router - Firebase -
Firestore - Firebase Authentication later for staff/admin

Do NOT introduce: - Tailwind - Redux - GraphQL - Express -
microservices - Docker - unnecessary UI libraries - unnecessary
state-management libraries - unnecessary animation libraries

Do not convert the project to TypeScript.

------------------------------------------------------------------------

## 6. Existing Firebase Setup

Firebase is already configured.

Existing files: - `src/services/firebase/config.js` -
`src/services/firebase/firestore.js`

Firebase project: **WaitWise**

Project ID: `waitwise-47dcd`

Do NOT create another Firebase initialization.

Do NOT replace the existing Firebase configuration.

Firestore collections: - `users` - `facilities` - `services` -
`queueEntries` - `predictions` - `auditLogs` - `counters`

Existing data:

`facilities/main-health-centre` - `name`: Main Health Centre -
`location`: Lusaka - `active`: true

`services/general-consultation` - `facilityId`: main-health-centre -
`name`: General Consultation - `code`: A - `active`: true - `capacity`:
1

`services/laboratory` - `facilityId`: main-health-centre - `name`:
Laboratory - `code`: B - `active`: true - `capacity`: 1

`services/pharmacy` - `facilityId`: main-health-centre - `name`:
Pharmacy - `code`: C - `active`: true - `capacity`: 1

`services/imaging` - `facilityId`: main-health-centre - `name`:
Imaging - `code`: D - `active`: true - `capacity`: 1

Counters already exist for the four services for the current date.

Do not recreate these records.

------------------------------------------------------------------------

## 7. Existing Queue Service

`src/services/queueService.js` already contains queue-related functionality including:
- `getServices()`
- `getServiceQueue()`
- `createQueueEntry()`

`createQueueEntry()` uses a Firestore transaction to safely generate
sequential tickets such as: - A001 - A002 - A003

Inspect and reuse the actual current implementation.

If the current implementation differs from this specification, preserve working code and make the smallest required change rather than creating duplicate functionality.

Do NOT duplicate these functions.

Do NOT replace the file unnecessarily.

------------------------------------------------------------------------

## 8. Code Organization --- Strict Separation of Concerns

Keep responsibilities separated.

Suggested structure:

``` text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   └── patient/
├── pages/
│   └── patient/
├── hooks/
│   └── patient/
├── services/
│   ├── firebase/
│   └── ...
├── constants/
│   ├── patientContent.js
│   ├── queueConstants.js
│   └── ...
├── utils/
│   ├── queue.js
│   ├── time.js
│   └── ...
├── styles/
│   ├── global/
│   └── patient/
├── routes/
└── App.jsx
```

Do not blindly create every file above. Create files only when they have
a real responsibility.

### Static/hard-coded content

Do NOT put large amounts of static text directly in JSX.

Separate, where practical: - navigation labels - headings -
descriptions - informational card text - helpful tips - accessibility
labels - button labels - status messages - footer messages

For example: `src/constants/patientContent.js`

### Dynamic data

Do NOT put dynamic data into constants.

Wrong:

``` javascript
const ticketNumber = "A106";
```

Correct: `ticketNumber` comes from Firestore/application state.

Dynamic data includes: - ticket number - service name - facility name -
queue position - people ahead - estimated wait - room - status -
timestamps

Reference screenshot values are examples only.

### Styles

Do NOT place one enormous CSS block inside page components.

Keep styles organized under the existing styles structure.

Avoid duplicated CSS.

### Components

Create reusable components for repeated visual patterns such as: -
Header - patient navigation - Ticket card - Information card - Queue
status card - Helpful tips card - Footer message - Service card -
Progress indicator - Back navigation - Primary button - Status icon
section

Do not create tiny components for every `<div>`.

### Hooks

Use hooks for React state/subscription logic where appropriate: -
service loading - selected service - queue state - real-time updates -
connection status - active ticket

Do not put complex subscription logic inside large page components.

### Services

Firebase/Firestore operations belong in service files.

Do not duplicate `queueService.js` functionality.

### Utilities

Pure calculations/helpers belong in utilities.

------------------------------------------------------------------------

## 9. Patient Account Model

Patients do NOT create accounts.

Patients can join a queue without an account.

Staff/admin authentication will be implemented separately.

Do not add patient authentication unless explicitly requested.

------------------------------------------------------------------------

## 10. Patient Routes

Planned routes:

``` text
/
/join
/confirm
/ticket
/track
/called
/complete
```

Flow:

``` text
Home
→ Join Queue
→ Confirm
→ Ticket
→ Track
→ Almost Next
→ Called
→ Complete
```

Do not create unnecessary routes for individual queue states.

------------------------------------------------------------------------

## 11. Queue Logic

Default queue ordering is FIFO.

Lifecycle:

``` text
WAITING
→ CALLED
→ IN_CONSULTATION
→ COMPLETED
```

Other states:

``` text
WAITING → CANCELLED
CALLED → NO_SHOW
```

When a patient joins: - create queue entry - generate ticket using
existing counter/transaction logic - `status = WAITING` - record
timestamps - return actual ticket number - display actual ticket

Do NOT hard-code A106, 4th in line, 3 people ahead, or 15--30 minutes.

------------------------------------------------------------------------

## 12. Queue Position

Do not permanently store queue position in Firestore.

Calculate dynamically using: - same facility - same service - earlier
queue position/time - currently waiting

The UI should update when the queue changes.

------------------------------------------------------------------------

## 13. Estimated Wait

Estimated waiting time is an estimate, not a guarantee.

Do not present an exact guaranteed time.

Use the existing/projected estimation logic rather than inventing a new
prediction system.

------------------------------------------------------------------------

## 14. Real-Time Updates

Use Firestore real-time listeners where appropriate.

Patients should not need to manually refresh.

Keep listeners lightweight because this is a Firebase free-plan
mini-project.

Do not create unnecessary reads/writes.

------------------------------------------------------------------------

## 15. Patient Ticket Persistence and Recovery

Patients do not have accounts.

The server/Firestore record is the source of truth.

The implementation should support:
- remembering the active ticket locally for convenience
- recovering an active ticket using its ticket information where appropriate
- keeping the ticket active if the patient closes the browser
- not cancelling a ticket merely because the page is closed
- allowing staff to assist if a patient loses the ticket

Do not treat browser storage as the source of truth.

Do not expose unrelated patients' queue information.

------------------------------------------------------------------------

## 16. Connection Handling

The patient experience should clearly communicate connection problems.

When connection is lost, show the last known queue state and make clear that the ticket remains active.

Example:

**Connection lost — showing your last update. Your ticket remains active.**

Patients should not be able to create a new queue ticket while offline.

Do not claim full offline queue synchronization.

------------------------------------------------------------------------

## 15. Implementation Stages --- DO NOT BUILD EVERYTHING AT ONCE

Do NOT implement all eight screens, all Firebase functionality, and all
supporting logic in one giant change.

The screenshots describe the complete patient experience, but
implementation must happen incrementally.

### Stage 1 --- Home

Build only: - Patient Home screen - reusable components needed for it -
styles - static content/constants - routing

Match:

```text
design-reference/DESIGNS/screen-1-home.jpg
```


Test before continuing.

### Stage 2 --- Join Queue

Build: - Join Queue / Select Service - service loading from Firestore -
service selection - required components - required hooks/services -
styles/content

Match:

```text
design-reference/DESIGNS/screen-2-join-queue.jpg
```


Test before continuing.

### Stage 3 --- Confirm

Build: - Confirm & Join Queue - selected-service data flow - queue
summary - confirmation information - Join Queue action - required
Firebase interaction

Match:

```text
design-reference/DESIGNS/screen-3-confirm.jpg
```


Test before continuing.

### Stage 4 --- Ticket

Build: - YOU'RE ALL SET! screen - actual generated ticket - queue
position - people ahead - estimated wait - last updated - ticket
persistence/retrieval needed for this stage

Match:

```text
design-reference/DESIGNS/screen-4-ticket.jpg
```


Then test:

``` text
Home
→ Join Queue
→ Select Service
→ Confirm
→ Join Queue
→ Ticket
```

Verify: - a real Firestore queue entry is created - a real ticket number
is generated - the real ticket is displayed

### Stages 5--8

Only after stages 1--4 work correctly:

- Stage 5 — Track My Queue (`design-reference/DESIGNS/screen-5-track.jpg`)
- Stage 6 — You're Almost Next (`design-reference/DESIGNS/screen-6-almost-next.jpg`)
- Stage 7 — It's Your Turn (`design-reference/DESIGNS/screen-7-called.jpg`)
- Stage 8 — Visit Complete (`design-reference/DESIGNS/screen-8-complete.jpg`)

Each stage must be implemented and tested before moving on.

------------------------------------------------------------------------

## 18. After Each Stage

After every stage:

1.  Run:

``` bash
npm run build
```

2.  Check for errors.
3.  Run the development server.
4.  Test the relevant route/functionality.
5.  Compare the screen against its reference screenshot.
6.  Fix visual/functional issues before proceeding.
7.  Do not make unrelated changes to future screens.

Report: - what was implemented - files created - files modified - what
was tested - whether the build succeeded - remaining issues

Do NOT proceed if the current stage has build errors or broken
functionality.

------------------------------------------------------------------------

## 19. Testing

For each stage: - run `npm run build` - fix all errors - run the
development server - test the route - verify Firebase interactions where
applicable - compare the visual result against the corresponding
screenshot

For stages 1--4 specifically verify: - Home loads - Join page loads -
services load from Firestore - service selection works - confirmation
receives selected service - Join Queue creates a Firestore queue entry -
ticket number is generated correctly - ticket page displays the real
ticket - navigation works

Do not claim something works unless it has actually been tested.

------------------------------------------------------------------------

## 20. Do Not Overwrite Working Code

Before modifying any existing file: - inspect it - understand it -
preserve working functionality - make the smallest reasonable change

If an existing file genuinely needs to be replaced entirely, explain why
first.

Do not silently delete functionality.

Do not create: - duplicate functions - duplicate Firebase
initialization - duplicate routes

------------------------------------------------------------------------

## 21. Final Instruction

The eight supplied screenshots are the **visual source of truth**.

Their exact project paths are:

```text
design-reference/DESIGNS/screen-1-home.jpg
design-reference/DESIGNS/screen-2-join-queue.jpg
design-reference/DESIGNS/screen-3-confirm.jpg
design-reference/DESIGNS/screen-4-ticket.jpg
design-reference/DESIGNS/screen-5-track.jpg
design-reference/DESIGNS/screen-6-almost-next.jpg
design-reference/DESIGNS/screen-7-called.jpg
design-reference/DESIGNS/screen-8-complete.jpg
```

Your job is NOT to redesign WaitWise.

Your job is to turn the approved designs into a working React website
while connecting them to the existing Firebase/Firestore functionality.

Preserve: - visual design - approved patient flow - approved wording -
existing Firebase architecture - separation of concerns - clean code
organization

Keep: - static content separate - constants separate - hooks separate -
services separate - utilities separate - styles separate - reusable
components separate - pages separate

Build incrementally.

Do not overwrite working code unnecessarily.

Do not build all eight screens in one giant change.

**Start by inspecting the existing project and all eight reference screenshots, report what you find, and then begin with Stage 1 — Home.**
