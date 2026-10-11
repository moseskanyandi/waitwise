# WaitWise Staff Website Agent Specification

## 1. Document purpose

This document is the implementation specification for the **WaitWise Staff Website**.

The staff interface must be implemented from the approved staff reference screenshots stored in:

```text
design-reference/STAFF/
```

The reference screenshots are the **visual source of truth** for the staff UI.

Do not redesign the screens, invent additional UI, or replace the approved visual direction with a different design.

The patient reference screenshots must remain separate and unchanged in:

```text
design-reference/DESIGNS/
```

---

# 2. Critical implementation rules

## 2.1 Reference-first rule

Before implementing any staff screen:

1. Inspect the corresponding screenshot in `design-reference/STAFF/`.
2. Match the screenshot's:
   - layout
   - spacing
   - proportions
   - typography
   - colors
   - cards
   - buttons
   - icons
   - borders
   - states
   - alignment
   - navigation
   - responsive behavior where applicable
3. Do not invent replacement UI simply because another design looks more modern.
4. Do not add fields or controls that are not present in the approved design unless explicitly required by this specification.
5. Do not remove a required element from the approved design without an explicit user decision.

The screenshots are implementation references, not loose inspiration.

---

## 2.2 No assumptions rule

Do not invent:

- patient names
- patient accounts
- patient profiles
- medical records
- diagnoses
- prescriptions
- consultation notes
- unsupported staff roles
- unsupported service types
- fake addresses
- fake facility information
- fake statistics
- fake queue records
- fake database controls
- fake notification systems
- unsupported permissions
- unsupported settings
- unsupported workflows

If implementation requires information that is not defined in the project specification or existing code/data model, stop and request clarification rather than inventing it.

---

# 3. WaitWise staff scope

The Staff website is used by authorized WaitWise staff to manage the queue for the service they are working with.

Current services:

1. General Consultation
2. Laboratory
3. Pharmacy
4. Imaging / X-ray

The staff interface must not mix unrelated service queues.

For example:

- General Consultation staff should work with General Consultation queue activity.
- Pharmacy staff should work with Pharmacy queue activity.
- Laboratory staff should work with Laboratory queue activity.
- Imaging / X-ray staff should work with Imaging / X-ray queue activity.

A staff member must not automatically see all services simply because they are logged into the Staff portal.

---

# 4. Staff navigation

The Staff sidebar must be service-neutral.

Use:

```text
Dashboard
Queue Management
History
Settings
```

Do NOT place:

```text
Consultation
```

as a permanent sidebar item.

Consultation is one of the WaitWise services, not a universal Staff navigation item.

The current/assigned service should instead be displayed in the page header or service context.

Example:

```text
Main Health Centre
General Consultation
```

Another authorized staff context may display:

```text
Main Health Centre
Pharmacy
```

Do not add a service-selection control unless the project's authorization/data model explicitly supports a staff member working with multiple services.

---

# 5. Authentication

## 5.1 Staff Login

Reference:

```text
design-reference/STAFF/staff-screen-1-login.jpg
```

If the actual reference filename differs, use the real filename in the folder.

### Required functionality

Staff login must support:

- Email
- Password
- Sign In
- Authentication error feedback
- Loading state
- Session persistence according to Firebase Auth behavior
- Secure sign-out

### Do not add

- Public staff sign-up
- Public admin sign-up
- Patient registration
- Google login unless explicitly required later
- Social login
- Unapproved authentication methods

Staff accounts are created/managed through authorized administration.

---

# 6. Staff Dashboard

Reference:

```text
design-reference/STAFF/staff-screen-2-dashboard.jpg
```

### Purpose

The dashboard gives staff a quick view of queue activity for the relevant service.

### It should show only service-relevant information

The dashboard may include the approved reference's:

- current queue state
- current patient/ticket state
- next eligible patient
- people waiting
- estimated waiting information
- queue status
- service name
- facility name
- other metrics only when present in the approved design and supported by WaitWise data

### Patient identity rule

Patients do not create WaitWise accounts.

Do not display patient names unless the project requirements/data model are explicitly changed to support them.

Use the queue ticket number as the patient-facing operational identifier.

Example:

```text
A106
```

Do not fabricate patient names as actual patient records.

### Call action rule

The Call action must not be enabled for every waiting patient.

Only the next eligible patient in the queue should have an enabled Call action.

Other waiting entries should have the Call action disabled or unavailable according to the approved design.

Eligibility must come from actual queue ordering/status logic, not hardcoded ticket numbers.

---

# 7. Queue Management

Reference:

```text
design-reference/STAFF/staff-screen-3-queue-management.jpg
```

### Purpose

Queue Management is the main operational screen for handling the service queue.

### Required behavior

It should allow authorized staff to:

- view the relevant service queue
- see ticket numbers
- see queue status
- see queue position/order where supported
- call the next eligible patient
- see the currently called/active ticket
- move the active queue entry through the supported workflow
- use the queue state supported by WaitWise

### Supported queue lifecycle

```text
WAITING
   ↓
CALLED
   ↓
IN_CONSULTATION
   ↓
COMPLETED
```

Other supported paths include:

```text
WAITING → CANCELLED
CALLED → NO_SHOW
```

Do not invent additional statuses.

### Queue order

The default queue order is FIFO unless an authorized facility priority/triage rule has explicitly been implemented.

Do not invent a new priority system in the UI.

### Queue source of truth

Firestore/server state is the source of truth.

Do not use hardcoded arrays as the production queue.

Local storage may only be used for convenience/recovery where already defined by the project.

---

# 8. Current Consultation

Reference:

```text
design-reference/STAFF/staff-screen-4-current-consultation.jpg
```

### Purpose

This screen represents the active service interaction after the staff member has called a queue ticket.

### It may display

Only information supported by the approved design and existing WaitWise data, such as:

- ticket number
- service
- facility
- room, if the operational record contains one
- called time
- consultation start time
- elapsed/duration information
- current status
- Complete Consultation action

### Completion

The staff member can complete the active queue entry.

The completion action must update the actual Firestore queue entry.

### Medical information

Do not add:

- diagnosis
- prescription
- medical history
- consultation notes
- symptoms
- treatment plans

These are outside the currently established WaitWise scope.

---

# 9. History

Reference:

```text
design-reference/STAFF/staff-screen-5-history.jpg
```

### Purpose

History shows previous queue activity handled by the relevant service.

### It should include

Where supported by actual queue data:

- ticket number
- status
- entered time
- called time
- consultation started time
- completed time
- actual waiting time where calculable

Supported statuses include:

- COMPLETED
- CANCELLED
- NO_SHOW

### Filters

Only implement filters shown in the approved reference and supported by the existing data.

Do not invent advanced filtering systems.

### Patient identity

Do not display patient names.

Queue history is operational history, not a medical-record system.

---

# 10. Staff Settings

Reference:

```text
design-reference/STAFF/staff-screen-6-settings.jpg
```

Staff Settings are limited to the two approved sections:

## General

Show staff account information such as:

- name
- email
- role
- facility
- assigned/current service where the existing project data supports it

Fields controlled by administration must be read-only for staff.

Staff must not change:

- role
- facility
- service assignment

unless the project's authorization model is explicitly changed later.

## Security

Provide:

- change password
- current password
- new password
- confirm new password
- sign out

### Do not add

Do not add:

- Notifications settings
- Database settings
- Backup controls
- Restore controls
- System maintenance
- Facility management
- Staff management
- Service management
- Queue configuration
- Theme customization

Those are not Staff Settings requirements.

---

# 11. Service isolation

Service isolation is a core Staff-side rule.

The UI must not mix:

```text
General Consultation
Laboratory
Pharmacy
Imaging / X-ray
```

inside one staff queue unless the current authorization/data model explicitly permits it.

Example:

### General Consultation staff

```text
Dashboard
→ General Consultation queue information

Queue Management
→ General Consultation queue

History
→ General Consultation history
```

### Pharmacy staff

```text
Dashboard
→ Pharmacy queue information

Queue Management
→ Pharmacy queue

History
→ Pharmacy history
```

The same principle applies to Laboratory and Imaging / X-ray.

---

# 12. Firestore data already established

The current queue-related collections include:

## users/{uid}

```text
name
email
role
facilityId
active
createdAt
```

Roles currently established:

```text
STAFF
ADMIN
```

Do not introduce roles such as Supervisor, Receptionist, Doctor, Nurse, Pharmacist, or Lab Technician unless the requirements are explicitly changed.

---

## facilities/{facilityId}

Current facility:

```text
main-health-centre
```

Current established information:

```text
name: Main Health Centre
location: Lusaka
active: true
```

Do not fabricate a street address.

---

## services/{serviceId}

Established services:

```text
general-consultation
laboratory
pharmacy
imaging
```

Display names:

```text
General Consultation
Laboratory
Pharmacy
Imaging / X-ray
```

---

## queueEntries/{entryId}

Established fields:

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

Optional operational field already supported:

```text
room
```

Do not permanently store queuePosition as the source of truth.

Queue position should be calculated from the current queue.

---

## predictions/{predictionId}

Established fields:

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

Estimated waiting time is an estimate, not a promise.

---

## auditLogs/{logId}

Established fields:

```text
actorId
action
queueEntryId
previousValue
newValue
reason
createdAt
```

---

# 13. Real-time behavior

The Staff UI must use live Firestore state where the project already supports it.

Queue pages should update when queue data changes.

Do not require the staff member to refresh the page to see ordinary queue changes.

The server/database remains the source of truth.

---

# 14. Error and connection states

The Staff website should handle:

- loading
- empty queue
- Firestore/network error
- temporary connection loss
- authentication failure
- unauthorized access
- unavailable service
- failed queue action

The interface should use the approved visual style and provide clear feedback.

Do not silently replace production Firestore data with fake patients.

---

# 15. Demo/preview data

Development-only preview states may exist for visual testing.

They must remain isolated from production.

Production screens must not contain seeded fake queue patients.

Development preview routes/state must never write fake patients to Firestore.

Do not use development demo state as production queue logic.

---

# 16. Security

Staff access must be controlled by Firebase Authentication and Firestore security rules.

A signed-in user is not automatically authorized to perform every staff action.

Role and active status must be respected.

Staff must not gain Admin functionality by changing frontend state or URL paths.

Security must be enforced server-side through Firestore rules/backend authorization where applicable.

Do not rely only on hiding buttons in React.

---

# 17. Code organization

Keep concerns separated.

Use the existing project structure:

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── patient/
│   ├── staff/
│   └── admin/
├── pages/
│   ├── patient/
│   ├── staff/
│   └── admin/
├── services/
│   └── firebase/
├── hooks/
├── utils/
├── routes/
├── styles/
├── constants/
├── App.jsx
└── main.jsx
```

Staff-specific components belong under:

```text
src/components/staff/
```

Staff pages belong under:

```text
src/pages/staff/
```

Do not put staff UI code inside patient components unless a truly shared component is appropriate.

---

# 18. Hardcoded content rule

Separate static display content from:

- hooks
- services
- Firebase logic
- data structures
- utility functions
- styling

Do not scatter hardcoded service names and UI text throughout business logic.

Use the existing constants/content organization where appropriate.

---

# 19. Routing

The Staff portal should have routes corresponding to:

```text
/staff/login
/staff/dashboard
/staff/queue
/staff/consultation
/staff/history
/staff/settings
```

If the existing project already uses a different route convention, preserve the established routing structure rather than creating duplicate routes.

Protect Staff routes so unauthenticated users cannot access them.

Protect Admin routes separately.

---

# 20. Responsive behavior

The approved screenshots are desktop references.

The implementation should preserve the same visual hierarchy while adapting responsibly to smaller widths.

Do not create horizontal overflow.

The sidebar should collapse/reflow appropriately if the existing application architecture supports responsive navigation.

Do not redesign the UI for mobile unless the reference or project requirements require it.

---

# 21. Visual design

Use the approved WaitWise healthcare visual language:

- healthcare green
- white/light neutral surfaces
- dark green text where appropriate
- restrained shadows
- rounded cards
- clear hierarchy
- professional healthcare appearance
- readable typography
- consistent spacing
- accessible contrast

Do not introduce:

- neon colors
- futuristic dashboards
- excessive gradients
- unrelated illustrations
- ocean/coastal imagery
- commercial/e-commerce styling

The Staff portal should look like a professional healthcare queue-management system.

---

# 22. Screen implementation order

Implement in this order:

```text
1. Staff Login
2. Staff Dashboard
3. Queue Management
4. Current Consultation
5. History
6. Settings
```

Do not implement all six screens in one uncontrolled change.

Complete and test each stage before moving to the next.

---

# 23. Stage requirements

For every implementation stage, provide:

## [A] Requirements addressed

Use only the existing project requirements and identify which requirements are being addressed.

Do not invent new requirements.

## [B] Technical decisions

Record technical decisions in:

```text
docs/decisions-log.md
```

Do not put requirements text into the technical decisions section.

## [C] Optional items

Do not change optional items unless explicitly approved.

## [D] Testing status

Use:

```text
Planned
→ Implemented
→ Tested
```

Do not mark an item Tested until it has actually been tested.

---

# 24. Testing requirements

After each staff screen:

1. Run the development server.
2. Open the actual screen.
3. Check the layout against its reference screenshot.
4. Test navigation.
5. Test loading/error states where applicable.
6. Test Firebase behavior where applicable.
7. Check the browser console for errors/warnings.
8. Run the production build.
9. Do not report the screen as complete merely because `npm run build` succeeds.

A successful build does not prove visual correctness.

---

# 25. Important implementation constraint

Do not create a patient-name field simply to make the Staff dashboard look more realistic.

WaitWise patients do not create accounts.

The operational identifier is the queue ticket.

Example:

```text
A106
```

If future requirements introduce patient identity, the data model and privacy/security requirements must be explicitly updated first.

---

# 26. Final Staff screen checklist

Before considering the Staff portal complete, verify:

- [ ] Staff Login implemented
- [ ] No public staff signup
- [ ] Staff Dashboard implemented
- [ ] Service-specific queue context works
- [ ] No unrelated service queues appear
- [ ] Patient names are not fabricated
- [ ] Queue Management implemented
- [ ] Only the eligible next patient can be called
- [ ] Other Call buttons are disabled/unavailable
- [ ] Current Consultation implemented
- [ ] Consultation completion updates the queue
- [ ] No medical notes/diagnosis/prescription features were added
- [ ] History implemented
- [ ] History contains operational queue information only
- [ ] Staff Settings implemented
- [ ] Settings contain General and Security only
- [ ] No unsupported Notifications/Database settings added
- [ ] Firebase is the production source of truth
- [ ] No seeded fake patients in production
- [ ] Firestore security rules remain enforced
- [ ] Real-time queue behavior works
- [ ] Error/loading states work
- [ ] All screens visually match their approved references
- [ ] Production build passes
- [ ] Actual browser testing completed
- [ ] No unrelated features were introduced

---

# 27. Reference folder structure

Keep patient and staff references separate:

```text
design-reference/
│
├── DESIGNS/
│   ├── waitwise-logo.jpg
│   ├── hero-image.jpg
│   ├── hero-image 2
│   ├── screen-1-home.jpg
│   ├── screen-2-join-queue.jpg
│   ├── screen-3-confirm.jpg
│   ├── screen-4-ticket.jpg
│   ├── screen-5-track.jpg
│   ├── screen-6-almost-next.jpg
│   ├── screen-7-called.jpg
│   └── screen-8-complete.jpg
│
├── STAFF/
│   ├── staff-screen-1-login.jpg
│   ├── staff-screen-2-dashboard.jpg
│   ├── staff-screen-3-queue-management.jpg
│   ├── staff-screen-4-current-consultation.jpg
│   ├── staff-screen-5-history.jpg
│   └── staff-screen-6-settings.jpg
│
└── ADMIN/
    └── [admin reference screenshots]
```

If the actual uploaded filenames differ, preserve the real filenames and update references in the specification rather than renaming files unnecessarily.

---

# 28. Final rule

**Do not code from assumptions.**

The approved reference screenshot + this specification + the existing WaitWise requirements/data model are the source of truth.

If a visual element conflicts with the requirements, do not silently implement it.

If a required implementation detail is missing, stop and ask for clarification.

Do not add functionality simply because it is common in other queue-management, hospital, or admin systems.

WaitWise is a focused academic mini-project and the implementation must remain within its established scope.
