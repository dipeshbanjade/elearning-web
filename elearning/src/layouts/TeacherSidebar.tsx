import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import superAdminRoute from "../admin/superadmin/superAdminRoute";

interface Props {
  open: boolean;
  onLinkClick: () => void;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
}

interface SubSubCategory {
  _id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
}

export default function TeacherSidebar({ open, onLinkClick }: Props) {
  const location = useLocation();
  const [subCategoriesOpen, setSubCategoriesOpen] = useState(
    location.pathname.startsWith("/teacher/content"),
  );
  const [openSubCatId, setOpenSubCatId] = useState("");

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>(
    [],
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link admin-nav-link ${isActive ? "active" : ""}`;

  const fetchTree = useCallback(async () => {
    try {
      const res = await superAdminRoute.getCategoryTree();
      setSubCategories(res?.subCategories ?? []);
      setSubSubCategories(res?.subSubCategories ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await fetchTree();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchTree]);

  const toggleSubCat = (id: string) => {
    setOpenSubCatId((current) => (current === id ? "" : id));
  };

  return (
    <aside
      className={`bg-white border-end admin-sidebar ${open ? "open" : ""}`}
    >
      <ul className="nav flex-column p-3">
        <li className="nav-item">
          <NavLink to="/teacher" end className={linkClass} onClick={onLinkClick}>
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="btn admin-nav-link d-flex align-items-center text-start w-100"
            onClick={() => setSubCategoriesOpen((o) => !o)}
          >
            📂 Subcategories
            <span className="ms-auto">{subCategoriesOpen ? "−" : "+"}</span>
          </button>

          {subCategoriesOpen && (
            <ul className="nav flex-column ps-3">
              {subCategories.map((sc) => {
                const children = subSubCategories.filter(
                  (ssc) => ssc.subCategoryId === sc._id,
                );
                const isOpen = openSubCatId === sc._id;

                return (
                  <li className="nav-item" key={sc._id}>
                    <button
                      type="button"
                      className="btn admin-nav-link d-flex align-items-center text-start w-100"
                      onClick={() => toggleSubCat(sc._id)}
                    >
                      {sc.name}
                      <span className="ms-auto">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <ul className="nav flex-column ps-3">
                        {children.map((ssc) => (
                          <li className="nav-item" key={ssc._id}>
                            <NavLink
                              to={`/teacher/content/${ssc._id}`}
                              className={linkClass}
                              onClick={onLinkClick}
                            >
                              {ssc.name}
                            </NavLink>
                          </li>
                        ))}
                        {children.length === 0 && (
                          <li className="nav-item">
                            <span className="text-muted small ps-2">
                              No subsubcategories yet
                            </span>
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}

              {subCategories.length === 0 && (
                <li className="nav-item">
                  <span className="text-muted small ps-2">
                    No subcategories yet
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
