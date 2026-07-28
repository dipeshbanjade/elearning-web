import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import LoginApi from "../api/login";
import { getStoredUser, clearStoredUser } from "../helper/helper";
import Loading from "../helper/Loading";

interface Props {
  children: ReactNode;
}

export default function UserLayout({ children }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = getStoredUser();

  const fullname = user?.fullname ?? "User";
  const initial = fullname.charAt(0).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (user?.token) await LoginApi.userLogout(user.token);
    } catch (error) {
      console.log(error);
    }
    clearStoredUser();
    navigate("/");
  };

  if (loggingOut) return <Loading />;

  return (
    <div className="app-layout">
      {/* ── Navbar ── */}
      <nav className="app-nav">
        <Link to="/dashboard" className="nav-logo">
          eLearning
        </Link>

        <div className="nav-right" ref={dropdownRef}>
          <button
            className="nav-avatar-btn"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <span className="avatar-circle">{initial}</span>
            <span className="avatar-name">{fullname}</span>
            <span className={`avatar-chevron ${open ? "open" : ""}`}>▼</span>
          </button>

          {open && (
            <div className="nav-dropdown">
              {/* User info */}
              <div className="dd-user">
                <div className="dd-user-name">{fullname}</div>
                <span className="dd-user-role">{user?.userRole ?? "user"}</span>
              </div>

              {/* Menu */}
              <div className="dd-menu">
                <Link to="/change-password" className="dd-item" onClick={close}>
                  <span className="dd-icon">🔑</span>
                  Change Password
                </Link>

                <Link to="/login-step" className="dd-item" onClick={close}>
                  <span className="dd-icon">📚</span>
                  Switch Class
                </Link>

                <Link to="/switch-sector" className="dd-item" onClick={close}>
                  <span className="dd-icon">🏷️</span>
                  Switch Sector
                </Link>

                <div className="dd-divider" />

                <button className="dd-item danger" onClick={handleLogout}>
                  <span className="dd-icon">🚪</span>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="app-body">{children}</main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <Link to="/terms">Terms &amp; Conditions</Link>
        <span className="footer-sep">•</span>
        <Link to="/privacy">Privacy Policy</Link>
        <span className="footer-sep">•</span>
        <Link to="/guidance">Guidance</Link>
        <span className="footer-sep">•</span>
        <Link to="/report">Report a Violation</Link>
        <span className="footer-copy">
          © {new Date().getFullYear()} eLearning. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
