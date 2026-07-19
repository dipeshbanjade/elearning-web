import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface Props {
  open: boolean;
  onLinkClick: () => void;
}

export default function AdminSidebar({ open, onLinkClick }: Props) {
  const location = useLocation();
  const [settingOpen, setSettingOpen] = useState(
    location.pathname.startsWith("/admin/setting"),
  );
  const [teacherOpen, setTeacherOpen] = useState(
    location.pathname.startsWith("/admin/teacher"),
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link admin-nav-link ${isActive ? "active" : ""}`;

  return (
    <aside
      className={`bg-white border-end admin-sidebar ${open ? "open" : ""}`}
    >
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <NavLink to="/admin" end className={linkClass} onClick={onLinkClick}>
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="btn admin-nav-link d-flex align-items-center text-start w-100"
            onClick={() => setSettingOpen((o) => !o)}
          >
            ⚙️ Setting
            <span className="ms-auto">{settingOpen ? "−" : "+"}</span>
          </button>

          {settingOpen && (
            <ul className="nav flex-column ps-4">
              <li className="nav-item">
                <NavLink
                  to="/admin/setting/company-profile"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  Company Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/setting/categories"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/setting/subcategories"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  Subcategories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/setting/subsubcategories"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  Subsubcategories
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="btn admin-nav-link d-flex align-items-center text-start w-100"
            onClick={() => setTeacherOpen((o) => !o)}
          >
            🎓 Teacher
            <span className="ms-auto">{teacherOpen ? "−" : "+"}</span>
          </button>

          {teacherOpen && (
            <ul className="nav flex-column ps-4">
              <li className="nav-item">
                <NavLink
                  to="/admin/teacher/list"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  List
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/teacher/assignment"
                  className={linkClass}
                  onClick={onLinkClick}
                >
                  Class &amp; Subject Assignment
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <NavLink
            to="/admin/learner"
            className={linkClass}
            onClick={onLinkClick}
          >
            🎓 Learner
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
