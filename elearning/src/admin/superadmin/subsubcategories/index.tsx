import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkValidation } from "../validation";
import superAdminRoute from "../superAdminRoute";
import Loading from "../../../helper/Loading";
import SubSubCategoriesList from "./list";

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
}

interface SubSubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  isActive?: boolean;
}

export default function Subsubcategories() {
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>(
    [],
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [subCategoryErrorMsg, setSubCategoryErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState<number>(1);
  const limit = 20;
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSubCategories = useCallback(async () => {
    try {
      const res = await superAdminRoute.getAllSubCategories(1, 1000);
      if (res) {
        setSubCategories(res?.data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchSubSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminRoute.getAllSubSubCategories(page, limit);
      if (res) {
        const pagination = res?.pagination ?? {};
        setSubSubCategories(res?.data ?? []);
        setTotalPage(parseInt(pagination.totalPages) || 1);
        setTotalCount(parseInt(pagination.total) || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) {
        await fetchSubCategories();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchSubCategories]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) {
        await fetchSubSubCategories();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchSubSubCategories]);

  const resetForm = () => {
    setEditingId(null);
    setSubCategoryId("");
    setCategoryName("");
    setDescription("");
    setErrorMsg("");
    setSubCategoryErrorMsg("");
    setShowForm(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryName(value);
    setErrorMsg(checkValidation(name, value));
  };

  const handleSubCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSubCategoryId(e.target.value);
    setSubCategoryErrorMsg(e.target.value ? "" : "Please select a subcategory");
  };

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = checkValidation("name", categoryName);
    if (error || !subCategoryId) {
      setErrorMsg(error);
      setSubCategoryErrorMsg(
        subCategoryId ? "" : "Please select a subcategory",
      );
      return;
    }

    const parentSubCategory = subCategories.find(
      (sc) => sc._id === subCategoryId,
    );
    if (!parentSubCategory) {
      setSubCategoryErrorMsg("Selected subcategory could not be found");
      return;
    }

    try {
      const payload = {
        name: categoryName,
        description,
        subCategoryId,
        categoryId: parentSubCategory.categoryId,
      };
      if (editingId) {
        await superAdminRoute.editSubSubCategory(editingId, payload);
      } else {
        await superAdminRoute.saveSubSubCategories(payload);
      }
      await fetchSubSubCategories();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEdit = (subSubCategory: SubSubCategory) => {
    setEditingId(subSubCategory._id);
    setSubCategoryId(subSubCategory.subCategoryId);
    setCategoryName(subSubCategory.name);
    setDescription(subSubCategory.description ?? "");
    setErrorMsg("");
    setSubCategoryErrorMsg("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await superAdminRoute.deleteSubSubCategory(id);
      await fetchSubSubCategories();
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
            <h1 className="page-title mb-0">Subsubcategories</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
            >
              {showForm ? "Close" : "+ Add Subsubcategory"}
            </button>
          </div>

          {showForm && (
            <div className="alert alert-info">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-2 align-items-start">
                  <div className="col-md-3">
                    <label className="form-label">Subcategory</label>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={subCategoryId}
                      onChange={handleSubCategorySelect}
                    >
                      <option value="">Select subcategory</option>
                      {subCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {subCategoryErrorMsg && (
                      <div className="text-danger mt-1">
                        {subCategoryErrorMsg}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row g-2 align-items-start mt-2">
                  <div className="col-md-3">
                    <label className="form-label">Subsubcategory Name</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      value={categoryName}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errorMsg && (
                      <div className="text-danger mt-1">{errorMsg}</div>
                    )}
                  </div>
                </div>
                <div className="row g-2 align-items-start mt-2">
                  <div className="col-md-3">
                    <label className="form-label">Description</label>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control"
                      rows={2}
                    />
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-success w-100">
                      {editingId ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-end mb-3">
            <span className="text-muted">Total: {totalCount}</span>
          </div>

          <div className="table-responsive">
            {subSubCategories.length > 0 ? (
              <SubSubCategoriesList
                data={subSubCategories}
                subCategories={subCategories}
                currentPage={page}
                pageSize={limit}
                totalPage={totalPage}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <h1>No Subsubcategories Data found</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
}
