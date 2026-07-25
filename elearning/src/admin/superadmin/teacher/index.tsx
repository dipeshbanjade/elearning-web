import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkValidation } from "../validation";
import { checkEmail, checkPassword } from "../../../helper/helper";
import superAdminApi from "../../../api/superAdminApi";
import superAdminRoute from "../superAdminRoute";
import Loading from "../../../helper/Loading";
import RightPanel from "../../../component/rightPanel";
import TeacherList from "./lists";
import type { UserRecord } from "../../../propsInterface/Interface";

const USER_ROLE = "teacher";

interface Category {
  _id: string;
  name: string;
}

const emptyCreateForm = {
  fullname: "",
  username: "",
  password: "",
  catId: "",
};

const emptyEditForm = {
  fullname: "",
  phoneNo: "",
  catId: "",
};

const emptyErrors = {
  fullnameErr: "",
  usernameErr: "",
  passwordErr: "",
  catIdErr: "",
};

export default function ManageTeacher() {
  const [teachers, setTeachers] = useState<UserRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [panelOpen, setPanelOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState<number>(1);
  const limit = 20;
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const res = await superAdminRoute.getAllCategories(1, 1000);
      setCategories(res?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.fetchUsersByRole(USER_ROLE, {
        page,
        limit,
        search,
      });
      if (res) {
        const pagination = res?.pagination ?? {};
        setTeachers(res?.data ?? []);
        setTotalPage(parseInt(pagination.totalPages) || 1);
        setTotalCount(parseInt(pagination.total) || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await fetchCategoryOptions();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchCategoryOptions]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await fetchTeachers();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchTeachers]);

  const resetForm = () => {
    setEditingUser(null);
    setCreateForm(emptyCreateForm);
    setEditForm(emptyEditForm);
    setErrors(emptyErrors);
    setPanelOpen(false);
  };

  const openCreatePanel = () => {
    setEditingUser(null);
    setCreateForm(emptyCreateForm);
    setErrors(emptyErrors);
    setPanelOpen(true);
  };

  const handleCreateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateCreate = () => {
    const next = { ...emptyErrors };
    let ok = true;

    const fullnameErr = checkValidation("name", createForm.fullname);
    if (fullnameErr) {
      next.fullnameErr = fullnameErr;
      ok = false;
    }
    if (!checkEmail(createForm.username)) {
      next.usernameErr = "Enter a valid email address";
      ok = false;
    }
    if (!checkPassword(createForm.password)) {
      next.passwordErr = "Password must be 6–16 characters";
      ok = false;
    }
    if (!createForm.catId) {
      next.catIdErr = "Please select a category";
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const validateEdit = () => {
    const next = { ...emptyErrors };
    let ok = true;

    const fullnameErr = checkValidation("name", editForm.fullname);
    if (fullnameErr) {
      next.fullnameErr = fullnameErr;
      ok = false;
    }
    if (!editForm.catId) {
      next.catIdErr = "Please select a category";
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const handleCreateSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreate()) return;

    try {
      await superAdminApi.createUser({
        fullname: createForm.fullname,
        username: createForm.username,
        password: createForm.password,
        confirmPassword: createForm.password,
        catId: createForm.catId,
        userRole: USER_ROLE,
      });
      await fetchTeachers();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEditSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser || !validateEdit()) return;

    try {
      await superAdminApi.updateUser(editingUser._id, {
        fullname: editForm.fullname,
        phoneNo: editForm.phoneNo,
        catId: editForm.catId,
      });
      await fetchTeachers();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEdit = (teacher: UserRecord) => {
    setEditingUser(teacher);
    setEditForm({
      fullname: teacher.fullname,
      phoneNo: teacher.phoneNo,
      catId: teacher.Category?.[0]?._id ?? "",
    });
    setErrors(emptyErrors);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await superAdminApi.deleteUser(id);
      await fetchTeachers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="page-title mb-0">Teacher</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreatePanel}
            >
              + Add Teacher
            </button>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div style={{ maxWidth: 300, flex: 1 }}>
              <input
                type="text"
                placeholder="Search teachers..."
                className="form-control"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <span className="text-muted ms-3">Total: {totalCount}</span>
          </div>

          <div className="table-responsive">
            {teachers.length > 0 ? (
              <TeacherList
                data={teachers}
                currentPage={page}
                pageSize={limit}
                totalPage={totalPage}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <h1>No Teacher Data found</h1>
            )}
          </div>
        </>
      )}

      <RightPanel
        isOpen={panelOpen}
        onClose={resetForm}
        title={editingUser ? "Edit Teacher" : "Add Teacher"}
      >
        {editingUser ? (
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={editingUser.username}
                className="form-control"
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={editForm.fullname}
                onChange={handleEditChange}
                className="form-control"
              />
              {errors.fullnameErr && (
                <div className="text-danger mt-1">{errors.fullnameErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phoneNo"
                value={editForm.phoneNo}
                onChange={handleEditChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="catId"
                value={editForm.catId}
                onChange={handleEditChange}
                className="form-select"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.catIdErr && (
                <div className="text-danger mt-1">{errors.catIdErr}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100">
              Update
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={createForm.fullname}
                onChange={handleCreateChange}
                className="form-control"
              />
              {errors.fullnameErr && (
                <div className="text-danger mt-1">{errors.fullnameErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="username"
                value={createForm.username}
                onChange={handleCreateChange}
                className="form-control"
              />
              {errors.usernameErr && (
                <div className="text-danger mt-1">{errors.usernameErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={createForm.password}
                onChange={handleCreateChange}
                className="form-control"
              />
              {errors.passwordErr && (
                <div className="text-danger mt-1">{errors.passwordErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="catId"
                value={createForm.catId}
                onChange={handleCreateChange}
                className="form-select"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.catIdErr && (
                <div className="text-danger mt-1">{errors.catIdErr}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100">
              Save
            </button>
          </form>
        )}
      </RightPanel>
    </div>
  );
}
