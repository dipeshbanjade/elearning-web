import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { checkValidation } from "../validation";
import superAdminRoute from "../superAdminRoute";
import Loading from "../../../helper/Loading";
import SubCategoriesList from "./list";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive?: boolean;
}

export default function Subcategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [categoryErrorMsg, setCategoryErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await superAdminRoute.getAllCategories(1, 1000);
      if (res) {
        setCategories(res?.data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminRoute.getAllSubCategories(
        page,
        limit,
        search,
      );
      if (res) {
        const pagination = res?.pagination ?? {};
        setSubCategories(res?.data ?? []);
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
      if (!ignore) {
        await fetchCategories();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchCategories]);

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

  const resetForm = () => {
    setEditingId(null);
    setCategoryId("");
    setSubCategoryName("");
    setDescription("");
    setNameErrorMsg("");
    setCategoryErrorMsg("");
    setShowForm(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubCategoryName(value);
    setNameErrorMsg(checkValidation(name, value));
  };

  const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setCategoryErrorMsg(e.target.value ? "" : "Please select a category");
  };

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = checkValidation("name", subCategoryName);
    if (error || !categoryId) {
      setNameErrorMsg(error);
      setCategoryErrorMsg(categoryId ? "" : "Please select a category");
      return;
    }

    try {
      const payload = { name: subCategoryName, description, categoryId };
      if (editingId) {
        await superAdminRoute.editSubCategory(editingId, payload);
      } else {
        await superAdminRoute.saveSubCategories(payload);
      }
      await fetchSubCategories();
    } catch (error) {
      console.error(error);
    }
    resetForm();
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingId(subCategory._id);
    setCategoryId(subCategory.categoryId);
    setSubCategoryName(subCategory.name);
    setDescription(subCategory.description ?? "");
    setNameErrorMsg("");
    setCategoryErrorMsg("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await superAdminRoute.deleteSubCategory(id);
      await fetchSubCategories();
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
            <h1 className="page-title mb-0">Subcategories</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
            >
              {showForm ? "Close" : "+ Add Subcategory"}
            </button>
          </div>

          {showForm && (
            <div className="alert alert-info">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-2 align-items-start">
                  <div className="col-md-3">
                    <label className="form-label">Category</label>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={handleCategorySelect}
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {categoryErrorMsg && (
                      <div className="text-danger mt-1">{categoryErrorMsg}</div>
                    )}
                  </div>
                </div>
                <div className="row g-2 align-items-start mt-2">
                  <div className="col-md-3">
                    <label className="form-label">Subcategory Name</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      value={subCategoryName}
                      onChange={handleNameChange}
                      className="form-control"
                    />
                    {nameErrorMsg && (
                      <div className="text-danger mt-1">{nameErrorMsg}</div>
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

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div style={{ maxWidth: 300, flex: 1 }}>
              <input
                type="text"
                placeholder="Search subcategories..."
                className="form-control"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <span className="text-muted ms-3">Total: {totalCount}</span>
          </div>

          <div className="table-responsive">
            {subCategories.length > 0 ? (
              <SubCategoriesList
                data={subCategories}
                categories={categories}
                currentPage={page}
                pageSize={limit}
                totalPage={totalPage}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <h1>No Subcategories Data found</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
}
