import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import superAdminRoute from "../admin/superadmin/superAdminRoute";

interface Props {
  open: boolean;
  onLinkClick: () => void;
}

interface AssignedSubject {
  subsubCatId: string;
  subsubcatName: string;
}

interface AssignedGrade {
  subCatId: string;
  subCatName: string;
  subjectMenu: AssignedSubject[];
}

interface AssignedCategory {
  categoryId: string;
  categoryName: string;
  submenu: AssignedGrade[];
}

export default function TeacherSidebar({ open, onLinkClick }: Props) {
  const location = useLocation();
  const [subCategoriesOpen, setSubCategoriesOpen] = useState(
    location.pathname.startsWith("/teacher/content"),
  );
  const [openSubCatId, setOpenSubCatId] = useState("");

  const [assignMenu, setAssignMenu] = useState<AssignedCategory[]>([]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link admin-nav-link ${isActive ? "active" : ""}`;

  const fetchTeacherMenu = useCallback(async () => {
    try {
      const res = await superAdminRoute.getTeacherMenu();
      setAssignMenu(res?.assignMenu ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await fetchTeacherMenu();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchTeacherMenu]);

  const toggleSubCat = (id: string) => {
    setOpenSubCatId((current) => (current === id ? "" : id));
  };

  const grades = assignMenu.flatMap((category) => category.submenu);

  return (
    <aside
      className={`bg-white border-end admin-sidebar ${open ? "open" : ""}`}
    >
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <NavLink
            to="/teacher"
            end
            className={linkClass}
            onClick={onLinkClick}
          >
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="btn admin-nav-link d-flex align-items-center text-start w-100"
            onClick={() => setSubCategoriesOpen((o) => !o)}
          >
            📂 My Subjects
            <span className="ms-auto">{subCategoriesOpen ? "−" : "+"}</span>
          </button>

          {subCategoriesOpen && (
            <ul className="nav flex-column ps-3">
              {grades.map((grade) => {
                const isOpen = openSubCatId === grade.subCatId;

                return (
                  <li className="nav-item" key={grade.subCatId}>
                    <button
                      type="button"
                      className="btn admin-nav-link d-flex align-items-center text-start w-100"
                      onClick={() => toggleSubCat(grade.subCatId)}
                    >
                      {grade.subCatName}
                      <span className="ms-auto">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <ul className="nav flex-column ps-3">
                        {grade.subjectMenu.map((subject) => (
                          <li className="nav-item" key={subject.subsubCatId}>
                            <NavLink
                              to={`/teacher/content/${subject.subsubCatId}`}
                              className={linkClass}
                              onClick={onLinkClick}
                            >
                              {subject.subsubcatName}
                            </NavLink>
                          </li>
                        ))}
                        {grade.subjectMenu.length === 0 && (
                          <li className="nav-item">
                            <span className="text-muted small ps-2">
                              No subjects assigned yet
                            </span>
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}

              {grades.length === 0 && (
                <li className="nav-item">
                  <span className="text-muted small ps-2">
                    No grades assigned yet
                  </span>
                </li>
              )}
            </ul>
          )}
        </li>

        <li className="nav-item">
          <NavLink
            to="/teacher/learner"
            className={linkClass}
            onClick={onLinkClick}
          >
            🎓 Learner
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/teacher/notice"
            className={linkClass}
            onClick={onLinkClick}
          >
            📢 Notice
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/teacher/assignment"
            className={linkClass}
            onClick={onLinkClick}
          >
            📝 Assignment
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
