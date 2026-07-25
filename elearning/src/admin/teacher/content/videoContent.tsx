import { useState } from "react";
import type { SubmitEvent } from "react";
import teacherRoute, { type ChapterDetail, type ChapterVideo } from "../teacherRoute";
import RightPanel from "../../../component/rightPanel";

const emptyVideoForm = { title: "", url: "", order: "" };

export default function VideoContent({
  chapterId,
  videos,
  onUpdate,
}: {
  chapterId: string;
  videos: ChapterVideo[];
  onUpdate: (chapter: ChapterDetail) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyVideoForm);
  const [urlError, setUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyVideoForm);
    setUrlError("");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyVideoForm);
    setUrlError("");
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (video: ChapterVideo) => {
    setForm({
      title: video.title ?? "",
      url: video.videoLink?.url ?? "",
      order: video.order != null ? String(video.order) : "",
    });
    setUrlError("");
    setEditingId(video._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.url.trim()) {
      setUrlError("Video URL is required");
      return;
    }

    const payload = {
      title: form.title,
      url: form.url,
      order: form.order ? Number(form.order) : undefined,
    };

    try {
      setSaving(true);
      const res = editingId
        ? await teacherRoute.updateChapterVideo(chapterId, editingId, payload)
        : await teacherRoute.addChapterVideo(chapterId, payload);
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
          + Add Video
        </button>
      </div>

      <RightPanel
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? "Edit video" : "Add video"}
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
            <label className="form-label">Video URL</label>
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

          <div className="mb-3">
            <label className="form-label">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, order: e.target.value }))
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
            <th>Link</th>
            <th>Order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={video._id}>
              <td>{index + 1}</td>
              <td>{video.title}</td>
              <td>
                {video.videoLink?.url && (
                  <a href={video.videoLink.url} target="_blank" rel="noreferrer">
                    {video.videoLink.url}
                  </a>
                )}
              </td>
              <td>{video.order ?? "-"}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(video)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {videos.length === 0 && <p className="text-muted">No videos yet.</p>}
    </div>
  );
}
