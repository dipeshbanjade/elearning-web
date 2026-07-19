import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkValidation } from "../validation";
import { checkEmail, checkPassword } from "../../../helper/helper";
import superAdminApi from "../../../api/superAdminApi";
import superAdminRoute from "../superAdminRoute";
import Loading from "../../../helper/Loading";
import RightPanel from "../../../component/rightPanel";
import LearnerList from "./lists";
import type { UserRecord } from "../../../propsInterface/Interface";

const USER_ROLE = "user";

interface Category {
  _id: string;
  name: string;
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

const emptyCreateForm = {
  fullname: "",
  username: "",
  password: "",
  catId: "",
  subcatId: "",
  subsubCatId: "",
};

const emptyEditForm = {
  fullname: "",
  phoneNo: "",
  catId: "",
  subcatId: "",
  subsubCatId: "",
};

const emptyErrors = {
  fullnameErr: "",
  usernameErr: "",
  passwordErr: "",
  catIdErr: "",
  subcatIdErr: "",
};

export default function ManageLearner() {
  const [learners, setLearners] = useState<UserRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>(
    [],
  );

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
      const res = await superAdminRoute.getCategoryTree();
      setCategories(res?.categories ?? []);
      setSubCategories(res?.subCategories ?? []);
      setSubSubCategories(res?.subSubCategories ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchLearners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.fetchUsersByRole(
        USER_ROLE,
        page,
        limit,
        search,
      );
      if (res) {
        const pagination = res?.pagination ?? {};
        setLearners(res?.data ?? []);
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
      if (!ignore) await fetchLearners();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchLearners]);

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
    setCreateForm((prev) => {
      if (name === "catId")
        return { ...prev, catId: value, subcatId: "", subsubCatId: "" };
      if (name === "subcatId")
        return { ...prev, subcatId: value, subsubCatId: "" };
      return { ...prev, [name]: value };
    });
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      if (name === "catId")
        return { ...prev, catId: value, subcatId: "", subsubCatId: "" };
      if (name === "subcatId")
        return { ...prev, subcatId: value, subsubCatId: "" };
      return { ...prev, [name]: value };
    });
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
    if (!createForm.subcatId) {
      next.subcatIdErr = "Please select a subcategory";
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
    if (!editForm.subcatId) {
      next.subcatIdErr = "Please select a subcategory";
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
        subcatId: createForm.subcatId,
        subsubCatId: createForm.subsubCatId || undefined,
        userRole: USER_ROLE,
      });
      await fetchLearners();
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
        subcatId: editForm.subcatId,
        subsubCatId: editForm.subsubCatId || undefined,
      });
      await fetchLearners();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEdit = (learner: UserRecord) => {
    setEditingUser(learner);
    setEditForm({
      fullname: learner.fullname,
      phoneNo: learner.phoneNo,
      catId: learner.Category?.[0]?._id ?? "",
      subcatId: learner.SubCategory?.[0]?._id ?? "",
      subsubCatId: learner.SubSubCategory?.[0]?._id ?? "",
    });
    setErrors(emptyErrors);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await superAdminApi.deleteUser(id);
      await fetchLearners();
    } catch (error) {
      console.error(error);
    }
  };

  const createSubCategories = subCategories.filter(
    (sc) => sc.categoryId === createForm.catId,
  );
  const editSubCategories = subCategories.filter(
    (sc) => sc.categoryId === editForm.catId,
  );
  const createSubSubCategories = subSubCategories.filter(
    (ssc) => ssc.subCategoryId === createForm.subcatId,
  );
  const editSubSubCategories = subSubCategories.filter(
    (ssc) => ssc.subCategoryId === editForm.subcatId,
  );

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="page-title mb-0">Learner</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreatePanel}
            >
              + Add Learner
            </button>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div style={{ maxWidth: 300, flex: 1 }}>
              <input
                type="text"
                placeholder="Search learners..."
                className="form-control"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <span className="text-muted ms-3">Total: {totalCount}</span>
          </div>

          <div className="table-responsive">
            {learners.length > 0 ? (
              <LearnerList
                data={learners}
                currentPage={page}
                pageSize={limit}
                totalPage={totalPage}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <h1>No Learner Data found</h1>
            )}
          </div>
        </>
      )}

      <RightPanel
        isOpen={panelOpen}
        onClose={resetForm}
        title={editingUser ? "Edit Learner" : "Add Learner"}
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

            <div className="mb-3">
              <label className="form-label">Subcategory</label>
              <select
                name="subcatId"
                value={editForm.subcatId}
                onChange={handleEditChange}
                className="form-select"
                disabled={!editForm.catId}
              >
                <option value="">Select subcategory</option>
                {editSubCategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.name}
                  </option>
                ))}
              </select>
              {errors.subcatIdErr && (
                <div className="text-danger mt-1">{errors.subcatIdErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Subsubcategory (optional)</label>
              <select
                name="subsubCatId"
                value={editForm.subsubCatId}
                onChange={handleEditChange}
                className="form-select"
                disabled={!editForm.subcatId}
              >
                <option value="">Select subsubcategory</option>
                {editSubSubCategories.map((ssc) => (
                  <option key={ssc._id} value={ssc._id}>
                    {ssc.name}
                  </option>
                ))}
              </select>
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

            <div className="mb-3">
              <label className="form-label">Subcategory</label>
              <select
                name="subcatId"
                value={createForm.subcatId}
                onChange={handleCreateChange}
                className="form-select"
                disabled={!createForm.catId}
              >
                <option value="">Select subcategory</option>
                {createSubCategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.name}
                  </option>
                ))}
              </select>
              {errors.subcatIdErr && (
                <div className="text-danger mt-1">{errors.subcatIdErr}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Subsubcategory (optional)</label>
              <select
                name="subsubCatId"
                value={createForm.subsubCatId}
                onChange={handleCreateChange}
                className="form-select"
                disabled={!createForm.subcatId}
              >
                <option value="">Select subsubcategory</option>
                {createSubSubCategories.map((ssc) => (
                  <option key={ssc._id} value={ssc._id}>
                    {ssc.name}
                  </option>
                ))}
              </select>
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
