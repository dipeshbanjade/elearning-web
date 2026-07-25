import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkValidation } from "../../superadmin/validation";
import superAdminRoute from "../../superadmin/superAdminRoute";
import teacherRoute, { type Chapter } from "../teacherRoute";
import Loading from "../../../helper/Loading";
import RightPanel from "../../../component/rightPanel";

interface SubSubCategory {
  _id: string;
  name: string;
  subCategoryId: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

const emptyChapterForm = {
  chapterTitle: "",
  chapterDesc: "",
  chapterThumbnail: "",
  orderColumn: "",
};

export default function TeacherContent() {
  const { id: subSubCategoryId } = useParams<{ id: string }>();
  if (!subSubCategoryId) return null;

  // Remount whenever the subsubcategory changes so all local state
  // (chapters, open form) resets on its own instead of needing an effect.
  return (
    <TeacherContentBody
      key={subSubCategoryId}
      subSubCategoryId={subSubCategoryId}
    />
  );
}

function TeacherContentBody({
  subSubCategoryId,
}: {
  subSubCategoryId: string;
}) {
  const navigate = useNavigate();
  const [subSubCategory, setSubSubCategory] = useState<SubSubCategory | null>(
    null,
  );
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [chapterForm, setChapterForm] = useState(emptyChapterForm);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      const [subCatRes, subSubCatRes, chapterRes] = await Promise.all([
        superAdminRoute.getAllSubCategories(1, 1000),
        superAdminRoute.getAllSubSubCategories(1, 1000),
        teacherRoute.fetchChapters(subSubCategoryId),
      ]);

      const ssc = (subSubCatRes?.data ?? []).find(
        (c: SubSubCategory) => c._id === subSubCategoryId,
      );
      setSubSubCategory(ssc ?? null);
      if (ssc) {
        const sc = (subCatRes?.data ?? []).find(
          (c: SubCategory) => c._id === ssc.subCategoryId,
        );
        setSubCategory(sc ?? null);
      }

      setChapters(chapterRes?.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [subSubCategoryId]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await loadPageData();
    })();
    return () => {
      ignore = true;
    };
  }, [loadPageData]);

  const resetChapterForm = () => {
    setChapterForm(emptyChapterForm);
    setTitleErrorMsg("");
    setEditingId(null);
    setShowChapterForm(false);
  };

  const openAddForm = () => {
    setChapterForm(emptyChapterForm);
    setTitleErrorMsg("");
    setEditingId(null);
    setShowChapterForm(true);
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingId(chapter._id);
    setChapterForm({
      chapterTitle: chapter.chapterTitle,
      chapterDesc: chapter.chapterDesc ?? "",
      chapterThumbnail: chapter.chapterThumbnail ?? "",
      orderColumn:
        chapter.orderColumn != null ? String(chapter.orderColumn) : "",
    });
    setTitleErrorMsg("");
    setShowChapterForm(true);
  };

  const handleChapterFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setChapterForm((prev) => ({ ...prev, [name]: value }));
    if (name === "chapterTitle")
      setTitleErrorMsg(checkValidation("name", value));
  };

  const handleChapterSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = checkValidation("name", chapterForm.chapterTitle);
    if (error) {
      setTitleErrorMsg(error);
      return;
    }

    const payload = {
      subSubCategoryId,
      chapterTitle: chapterForm.chapterTitle,
      chapterDesc: chapterForm.chapterDesc,
      chapterThumbnail: chapterForm.chapterThumbnail,
      orderColumn: chapterForm.orderColumn
        ? Number(chapterForm.orderColumn)
        : undefined,
    };

    try {
      setSaving(true);
      if (editingId) {
        const res = await teacherRoute.updateChapter(editingId, payload);
        setChapters((prev) =>
          prev.map((c) => (c._id === editingId ? res.data : c)),
        );
      } else {
        const res = await teacherRoute.createChapter(payload);
        setChapters((prev) => [...prev, res.data]);
      }
      resetChapterForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (!subSubCategory) {
    return (
      <div>
        <h1 className="page-title">Content</h1>
        <p className="text-muted">
          This subsubcategory could not be found. Pick one from the
          Subcategories menu on the left.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted mb-1">
        {subCategory?.name ?? "Subcategory"} / {subSubCategory.name}
      </p>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title mb-0">{subSubCategory.name}</h1>
        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          + Add Chapter
        </button>
      </div>

      <RightPanel
        isOpen={showChapterForm}
        onClose={resetChapterForm}
        title={editingId ? "Edit chapter" : "Add chapter"}
      >
        <form onSubmit={handleChapterSubmit}>
          <div className="mb-3">
            <label className="form-label">Chapter title</label>
            <input
              type="text"
              name="chapterTitle"
              value={chapterForm.chapterTitle}
              onChange={handleChapterFieldChange}
              className="form-control"
            />
            {titleErrorMsg && (
              <div className="text-danger mt-1">{titleErrorMsg}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="chapterDesc"
              value={chapterForm.chapterDesc}
              onChange={handleChapterFieldChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Order column</label>
            <input
              type="number"
              name="orderColumn"
              value={chapterForm.orderColumn}
              onChange={handleChapterFieldChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Thumbnail URL (optional)</label>
            <input
              type="text"
              name="chapterThumbnail"
              value={chapterForm.chapterThumbnail}
              onChange={handleChapterFieldChange}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={saving}
          >
            {saving ? "Saving..." : editingId ? "Update" : "Save"}
          </button>
        </form>
      </RightPanel>

      <div className="tag-folder-grid">
        {chapters.map((chapter) => (
          <div
            key={chapter._id}
            className="tag-folder-card"
            onClick={() =>
              navigate(`/teacher/content/${subSubCategoryId}/chapter/${chapter._id}`)
            }
          >
            <button
              type="button"
              className="tag-folder-edit-btn"
              title="Edit chapter"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(chapter);
              }}
            >
              ✏️
            </button>
            <span className="tag-folder-icon">📁</span>
            <span>{chapter.chapterTitle}</span>
            {chapter.chapterDesc && (
              <span className="tag-folder-unit">{chapter.chapterDesc}</span>
            )}
          </div>
        ))}

        {chapters.length === 0 && (
          <p className="text-muted">
            No chapters yet — add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
