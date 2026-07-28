import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import LoginApi from "../api/login";
import { getStoredUser, clearStoredUser } from "../helper/helper";
import Loading from "../helper/Loading";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = getStoredUser();
  const fullname = user?.fullname ?? "Teacher";
  const initial = fullname.charAt(0).toUpperCase();

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

  // Only teachers get past here — same guard style as SuperAdminLayout.
  if (!user?.token) return <Navigate to="/" replace />;
  if (user.userRole !== "teacher") return <Navigate to="/dashboard" replace />;

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
      <nav className="app-nav">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="navbar-toggler admin-toggler"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <Link
            to="/teacher"
            className="nav-logo"
            onClick={() => setSidebarOpen(false)}
          >
            eLearning Teacher
          </Link>
        </div>

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
              <div className="dd-user">
                <div className="dd-user-name">{fullname}</div>
                <span className="dd-user-role">
                  {user?.userRole ?? "teacher"}
                </span>
              </div>

              <div className="dd-menu">
                <button className="dd-item danger" onClick={handleLogout}>
                  <span className="dd-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="admin-shell">
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 sidebar-backdrop"
            style={{ pointerEvents: "auto" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <TeacherSidebar
          open={sidebarOpen}
          onLinkClick={() => setSidebarOpen(false)}
        />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
