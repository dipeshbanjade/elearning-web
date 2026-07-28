import { useState } from "react";
import type { SubmitEvent } from "react";
import { checkValidation } from "../../superadmin/validation";
import teacherRoute, {
  type ChapterDetail,
  type ChapterContentItem,
} from "../teacherRoute";
import RightPanel from "../../../component/rightPanel";
import RichTextEditor from "../../../component/RichTextEditor";

const emptyContentForm = { title: "", content: "" };

export default function ContentBody({
  chapterId,
  contents,
  onUpdate,
}: {
  chapterId: string;
  contents: ChapterContentItem[];
  onUpdate: (chapter: ChapterDetail) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyContentForm);
  const [titleError, setTitleError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyContentForm);
    setTitleError("");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyContentForm);
    setTitleError("");
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: ChapterContentItem) => {
    setForm({ title: item.title, content: item.content ?? "" });
    setTitleError("");
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = checkValidation("name", form.title);
    if (error) {
      setTitleError(error);
      return;
    }

    try {
      setSaving(true);
      const res = editingId
        ? await teacherRoute.updateChapterContent(chapterId, editingId, form)
        : await teacherRoute.addChapterContent(chapterId, form);
      onUpdate(res.data);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openAddForm}
        >
          + Add Content
        </button>
      </div>

      <RightPanel
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? "Edit content" : "Add content"}
        width={760}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, title: value }));
                setTitleError(checkValidation("name", value));
              }}
              className="form-control"
            />
            {titleError && <div className="text-danger mt-1">{titleError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <RichTextEditor
              value={form.content}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, content: value }))
              }
              placeholder="Write the lesson content..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-3"
            disabled={saving}
          >
            {saving ? "Saving..." : editingId ? "Update" : "Save"}
          </button>
        </form>
      </RightPanel>

      <table className="table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contents.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {contents.length === 0 && (
        <p className="text-muted">No content yet.</p>
      )}
    </div>
  );
}
