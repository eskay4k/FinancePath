import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ExternalLink, Menu, X } from "lucide-react";
import { useAuth } from "../auth-context";
import { useProgress } from "../useProgress";
import { FEEDBACK_FORM_URL, LEGAL_CONTACT } from "../config";

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="FinancePath home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="M7 25V7h18M7 16h13" />
          <circle cx="25" cy="25" r="2.6" />
        </svg>
      </span>
      <span>
        FinancePath<span className="brand-period">.</span>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { profile, progress } = useProgress();
  const { user, signOut } = useAuth();
  const publicPage =
    [
      "/",
      "/signup",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/auth/confirm",
    ].includes(location.pathname) || location.pathname === "/assessment";
  const links = publicPage
    ? [["/about", "About"]]
    : [
        ["/dashboard", "Dashboard"],
        ["/headlines", "Headlines"],
        ["/fundamentals", "Money basics"],
        ["/progress", "Progress"],
        ["/about", "About"],
      ];
  const menuRef = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-nav"
          ref={menuRef}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              menuRef.current?.focus();
            }
          }}
        >
          {links.map(([to, label]) => (
            <NavLink to={to} key={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          {user && (
            <Link to="/account" onClick={() => setOpen(false)}>
              Account
            </Link>
          )}
          {user ? (
            <button className="nav-logout" onClick={() => void signOut()}>
              Log out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              Log in
            </Link>
          )}
          <Link
            className="nav-cta"
            to={
              profile ? (publicPage ? "/dashboard" : "/assessment") : "/signup"
            }
            onClick={() => setOpen(false)}
          >
            {profile
              ? publicPage
                ? "My dashboard"
                : `${progress.selectedLevel ?? "Find your"} level`
              : "Get started"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      </div>
      <span className="sr-only">Current page: {location.pathname}</span>
    </header>
  );
}
export function Footer() {
  let feedbackReady = false;
  try {
    feedbackReady = ["http:", "https:"].includes(
      new URL(FEEDBACK_FORM_URL).protocol,
    );
  } catch {
    /* No configured form. */
  }
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Brand />
          <p>A little clarity. A more confident you.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">Our mission</Link>
          <Link to="/legal/privacy">Privacy</Link>
          <Link to="/legal/terms">Terms</Link>
          <Link to="/legal/cookies">Storage & cookies</Link>
          <Link to="/legal/refunds">Pricing & refunds</Link>
          <Link to="/legal/sources">Sources & licenses</Link>
          <Link to="/legal/accessibility">Accessibility</Link>
          <Link to="/about#methodology">How we choose sources</Link>
          {feedbackReady ? (
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share feedback <ExternalLink size={14} aria-hidden="true" />
            </a>
          ) : (
            <a href={`mailto:${LEGAL_CONTACT}?subject=FinancePath%20feedback`}>
              Share feedback
            </a>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          For learning, not financial advice. News links to its publishers;
          practice lessons use illustrative examples.
        </p>
        <span>FinancePath · Student-led learning</span>
      </div>
    </footer>
  );
}
export function RouteFocus() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    document
      .querySelector<HTMLElement>("main h1")
      ?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
