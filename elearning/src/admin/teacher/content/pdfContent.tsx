import { useState } from "react";
import type { SubmitEvent } from "react";
import teacherRoute, { type ChapterDetail, type ChapterPdf } from "../teacherRoute";
import RightPanel from "../../../component/rightPanel";

const emptyPdfForm = { title: "", url: "" };

export default function PdfContent({
  chapterId,
  pdfs,
  onUpdate,
}: {
  chapterId: string;
  pdfs: ChapterPdf[];
  onUpdate: (chapter: ChapterDetail) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPdfForm);
  const [urlError, setUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyPdfForm);
    setUrlError("");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyPdfForm);
    setUrlError("");
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (pdf: ChapterPdf) => {
    setForm({ title: pdf.title ?? "", url: pdf.file?.url ?? "" });
    setUrlError("");
    setEditingId(pdf._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.url.trim()) {
      setUrlError("PDF URL is required");
      return;
    }

    try {
      setSaving(true);
      const res = editingId
        ? await teacherRoute.updateChapterPdf(chapterId, editingId, form)
        : await teacherRoute.addChapterPdf(chapterId, form);
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
          + Add PDF
        </button>
      </div>

      <RightPanel
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? "Edit PDF / book" : "Add PDF / book"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">PDF URL</label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, url: e.target.value }));
                setUrlError("");
              }}
              className="form-control"
            />
            {urlError && <div className="text-danger mt-1">{urlError}</div>}
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
            <th>Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf, index) => (
            <tr key={pdf._id}>
              <td>{index + 1}</td>
              <td>{pdf.title}</td>
              <td>
                {pdf.file?.url && (
                  <a href={pdf.file.url} target="_blank" rel="noreferrer">
                    {pdf.file.url}
                  </a>
                )}
              </td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(pdf)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pdfs.length === 0 && <p className="text-muted">No PDFs yet.</p>}
    </div>
  );
}
