import { useState } from "react";
import type { SubmitEvent } from "react";
import { checkValidation } from "../../superadmin/validation";
import teacherRoute, {
  type ChapterDetail,
  type ChapterAssignment,
} from "../teacherRoute";
import RightPanel from "../../../component/rightPanel";
import RichTextEditor from "../../../component/RichTextEditor";

const emptyAssignmentForm = { title: "", hint: "", deadline: "" };

export default function AssignmentContent({
  chapterId,
  assignments,
  onUpdate,
}: {
  chapterId: string;
  assignments: ChapterAssignment[];
  onUpdate: (chapter: ChapterDetail) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAssignmentForm);
  const [titleError, setTitleError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyAssignmentForm);
    setTitleError("");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyAssignmentForm);
    setTitleError("");
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (assignment: ChapterAssignment) => {
    setForm({
      title: assignment.title ?? "",
      hint: assignment.hint ?? "",
      deadline: assignment.deadline?.slice(0, 10) ?? "",
    });
    setTitleError("");
    setEditingId(assignment._id);
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
        ? await teacherRoute.updateChapterAssignment(chapterId, editingId, form)
        : await teacherRoute.addChapterAssignment(chapterId, form);
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
          + Add Assignment
        </button>
      </div>

      <RightPanel
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? "Edit assignment" : "Add assignment"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setTitleError(checkValidation("name", e.target.value));
              }}
              className="form-control"
            />
            {titleError && <div className="text-danger mt-1">{titleError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Hint</label>
            <RichTextEditor
              value={form.hint}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, hint: value }))
              }
              placeholder="Write a hint — use the ƒ button to insert a LaTeX formula..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, deadline: e.target.value }))
              }
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

      <table className="table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Title</th>
            <th>Hint</th>
            <th>Deadline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={assignment._id}>
              <td>{index + 1}</td>
              <td>{assignment.title}</td>
              <td dangerouslySetInnerHTML={{ __html: assignment.hint ?? "" }} />
              <td>{assignment.deadline?.slice(0, 10)}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(assignment)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assignments.length === 0 && (
        <p className="text-muted">No assignments yet.</p>
      )}
    </div>
  );
}
