import { useState } from "react";
import type { SubmitEvent } from "react";
import teacherRoute, {
  type ChapterDetail,
  type ChapterPractice,
} from "../teacherRoute";
import RightPanel from "../../../component/rightPanel";
import RichTextEditor from "../../../component/RichTextEditor";

const emptyPracticeForm = { question: "", options: "", answer: "" };

export default function PracticeQuestion({
  chapterId,
  practices,
  onUpdate,
}: {
  chapterId: string;
  practices: ChapterPractice[];
  onUpdate: (chapter: ChapterDetail) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPracticeForm);
  const [questionError, setQuestionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyPracticeForm);
    setQuestionError("");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyPracticeForm);
    setQuestionError("");
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (practice: ChapterPractice) => {
    setForm({
      question: practice.question,
      options: (practice.option ?? []).join("\n"),
      answer: practice.answer,
    });
    setQuestionError("");
    setEditingId(practice._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const questionText = form.question.replace(/<[^>]*>/g, "").trim();
    if (!questionText) {
      setQuestionError("Question is required");
      return;
    }

    const option = form.options
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);

    const payload = { question: form.question, option, answer: form.answer };

    try {
      setSaving(true);
      const res = editingId
        ? await teacherRoute.updateChapterPractice(chapterId, editingId, payload)
        : await teacherRoute.addChapterPractice(chapterId, payload);
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
          + Add Question
        </button>
      </div>

      <RightPanel
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? "Edit practice question" : "Add practice question"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <RichTextEditor
              value={form.question}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, question: value }));
                setQuestionError("");
              }}
              placeholder="Write the question — use the ƒ button to insert a LaTeX formula..."
            />
            {questionError && (
              <div className="text-danger mt-1">{questionError}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Options (one per line)</label>
            <textarea
              value={form.options}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, options: e.target.value }))
              }
              className="form-control"
              rows={4}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correct answer</label>
            <input
              type="text"
              value={form.answer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, answer: e.target.value }))
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
            <th>Question</th>
            <th>Options</th>
            <th>Answer</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {practices.map((practice, index) => (
            <tr key={practice._id}>
              <td>{index + 1}</td>
              <td dangerouslySetInnerHTML={{ __html: practice.question }} />
              <td>{practice.option?.join(", ")}</td>
              <td>{practice.answer}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(practice)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {practices.length === 0 && (
        <p className="text-muted">No practice questions yet.</p>
      )}
    </div>
  );
}
