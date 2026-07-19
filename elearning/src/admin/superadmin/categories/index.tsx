import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkValidation } from "../validation";
import superAdminRoute from "../superAdminRoute";
import Loading from "../../../helper/Loading";
import CategoriesList from "./list";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState<number>(1);
  const limit = 20;
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminRoute.getAllCategories(page, limit);
      if (res) {
        const pagination = res?.pagination ?? {};
        setCategories(res?.data ?? []);
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
        await fetchCategories();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchCategories]);

  const resetForm = () => {
    setEditingId(null);
    setCategoryName("");
    setDescription("");
    setErrorMsg("");
    setShowForm(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryName(value);
    setErrorMsg(checkValidation(name, value));
  };

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = checkValidation("name", categoryName);
    if (error) {
      setErrorMsg(error);
      return;
    }

    try {
      const payload = { name: categoryName, description };
      if (editingId) {
        await superAdminRoute.editCategories(editingId, payload);
      } else {
        await superAdminRoute.saveCategories(payload);
      }
      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setCategoryName(category.name);
    setDescription(category.description ?? "");
    setErrorMsg("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await superAdminRoute.deleteCategory(id);
      await fetchCategories();
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
            <h1 className="page-title mb-0">Categories</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
            >
              {showForm ? "Close" : "+ Add Category"}
            </button>
          </div>

          {showForm && (
            <div className="alert alert-info">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-2 align-items-start">
                  <div className="col-md-3">
                    <label className="form-label">Category Name</label>
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
            {categories.length > 0 ? (
              <CategoriesList
                data={categories}
                currentPage={page}
                pageSize={limit}
                totalPage={totalPage}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <h1>No Categories Data found</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
}
