import { useEffect, useState } from "react";
import {
  getActiveStaffProfile,
  sendStaffPasswordReset,
  signInStaff,
  signOutStaff,
  subscribeToAuthState,
} from "../../services/firebase/staffAuth.js";
import { ArrowRightIcon, ShieldIcon } from "../../components/common/Icons.jsx";
import staffLoginReference from "../../../design-reference/STAFF/staff-screen-1-login.png";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  );
}

function VisibilityIcon({ visible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {visible ? (
        <>
          <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 6.1A10.8 10.8 0 0 1 12 6c6.4 0 10 6 10 6a15 15 0 0 1-3.1 3.6M6.2 6.2C3.5 8 2 12 2 12s3.6 6 10 6c1 0 2-.2 2.8-.5" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </svg>
  );
}

function getAuthErrorMessage(error) {
  if (error.code === "staff/not-authorized") {
    return "This account is not authorized for Staff access.";
  }
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(error.code)) {
    return "The email address or password is incorrect.";
  }
  if (error.code === "auth/user-disabled") {
    return "This account is unavailable. Contact your administrator.";
  }
  if (error.code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (error.code === "auth/network-request-failed") {
    return "A connection problem prevented sign in. Check your connection and try again.";
  }
  return "We could not verify Staff access. Please try again.";
}

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [staffSession, setStaffSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    return subscribeToAuthState(async (user) => {
      if (!user) {
        setStaffSession(null);
        setCheckingSession(false);
        return;
      }

      setCheckingSession(true);
      try {
        const profile = await getActiveStaffProfile(user.uid);
        if (!profile) {
          await signOutStaff();
          setFeedback({
            type: "error",
            text: "This account is not authorized for Staff access.",
          });
          setStaffSession(null);
          return;
        }

        setStaffSession({ user, profile });
        setFeedback(null);
      } catch {
        await signOutStaff().catch(() => {});
        setStaffSession(null);
        setFeedback({
          type: "error",
          text: "We could not verify Staff access. Please try again.",
        });
      } finally {
        setCheckingSession(false);
      }
    }, () => {
      setCheckingSession(false);
      setFeedback({
        type: "error",
        text: "We could not check your sign-in status. Please reload and try again.",
      });
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      await signInStaff(email.trim(), password);
    } catch (error) {
      setFeedback({ type: "error", text: getAuthErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    setFeedback(null);
    if (!email.trim()) {
      setFeedback({ type: "error", text: "Enter your email address to request a password reset." });
      return;
    }

    setResetting(true);
    try {
      await sendStaffPasswordReset(email.trim());
      setFeedback({
        type: "success",
        text: "If an account exists for that email, a password reset link has been sent.",
      });
    } catch {
      setFeedback({ type: "error", text: "We could not send a password reset link. Please try again." });
    } finally {
      setResetting(false);
    }
  }

  async function handleSignOut() {
    setSubmitting(true);
    setFeedback(null);
    try {
      await signOutStaff();
    } catch {
      setFeedback({ type: "error", text: "We could not sign you out. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="staff-login">
      <aside className="staff-login__brand-panel" aria-label="WaitWise staff access">
        <img className="staff-login__reference-panel" src={staffLoginReference} alt="" aria-hidden="true" />
        <div className="staff-login__sr-only">
          <h1>WaitWise</h1>
          <p>Smarter Queues. Better Care.</p>
          <h2>Smart Queue Management</h2>
          <p>Helping healthcare teams manage patient queues efficiently and keep care moving.</p>
          <p>Better flow. Healthier communities.</p>
        </div>
      </aside>

      <section className="staff-login__form-panel" aria-labelledby="staff-login-title">
        <div className="staff-login__form-content">
          {checkingSession ? (
            <div className="staff-login__checking" role="status" aria-live="polite">
              <span className="staff-login__spinner" />
              Checking your session...
            </div>
          ) : staffSession ? (
            <div className="staff-login__signed-in">
              <div className="staff-login__secure-icon"><ShieldIcon size={28} /></div>
              <h1 id="staff-login-title">You're signed in</h1>
              <p className="staff-login__subtitle">Staff access verified for {staffSession.user.email}.</p>
              {feedback && <p className={`staff-login__feedback staff-login__feedback--${feedback.type}`} role="alert">{feedback.text}</p>}
              <button className="staff-login__submit" type="button" onClick={handleSignOut} disabled={submitting}>
                {submitting ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <>
              <header className="staff-login__form-heading">
                <h1 id="staff-login-title">Welcome back</h1>
                <p>Sign in to your WaitWise staff account.</p>
              </header>

              <form className="staff-login__form" onSubmit={handleSubmit}>
                <label className="staff-login__label" htmlFor="staff-email">Email address</label>
                <div className="staff-login__input-wrap">
                  <MailIcon />
                  <input
                    id="staff-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="Enter your staff email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <label className="staff-login__label staff-login__label--password" htmlFor="staff-password">Password</label>
                <div className="staff-login__input-wrap">
                  <LockIcon />
                  <input
                    id="staff-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    className="staff-login__visibility"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    <VisibilityIcon visible={showPassword} />
                  </button>
                </div>

                <div className="staff-login__reset-row">
                  <button className="staff-login__reset" type="button" onClick={handlePasswordReset} disabled={resetting || submitting}>
                    {resetting ? "Sending..." : "Forgot password?"}
                  </button>
                </div>

                {feedback && <p className={`staff-login__feedback staff-login__feedback--${feedback.type}`} role="alert">{feedback.text}</p>}

                <button className="staff-login__submit" type="submit" disabled={submitting || resetting}>
                  {submitting ? "Signing In..." : <>Sign In <ArrowRightIcon size={20} /></>}
                </button>
              </form>

              <div className="staff-login__notice">
                <ShieldIcon size={22} />
                <span>Authorized staff access only.</span>
              </div>
            </>
          )}
        </div>
        <footer className="staff-login__footer">WaitWise <span aria-hidden="true">•</span> Healthcare Queue Management</footer>
      </section>
    </main>
  );
}