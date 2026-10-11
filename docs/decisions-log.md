# Technical Decisions

## 2026-10-08 - Stage 1A Staff Login

- Staff authentication uses Firebase email/password sign-in only; no account creation is exposed.
- A Staff session is accepted only when `users/{uid}` exists with `role == "STAFF"` and `active == true`. The Firestore rules enforce the same condition for Staff-authorized operations.
- Firebase Auth's web SDK persistence behavior is retained; no persistence override is introduced.
- `/staff/login` is the only Staff route in this stage. Until a later screen is approved and implemented, an authorized session remains on the login route and can securely sign out.
- The reference's password-reset control sends Firebase's standard password-reset email and gives non-enumerating feedback.
- Admin-only Firestore rules remain unchanged; the Staff portal does not grant Admin access.

### Testing Status

- Implemented: Firebase-backed login, profile authorization, reset flow, sign-out, and login UI.
- Tested: production build, targeted lint, desktop/mobile rendering, password visibility toggle, no horizontal overflow, password-reset empty-email feedback, and no browser console errors.
- Not tested: live sign-in, active/inactive/role authorization against Firebase, reset email delivery, and sign-out with a real account; no test credentials were available.
- Rules validation: `firebase deploy --only firestore:rules --dry-run` reached the remote rules check but failed on the Rules API request. The Firestore emulator started and loaded the rules, but its `emulators:exec` wrapper checks could not complete due to command quoting and then an unavailable default port. No rules were deployed.