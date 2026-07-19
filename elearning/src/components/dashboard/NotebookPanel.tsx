import type { NotebookResource } from "../../data/mockDashboard";

interface Props {
  topicTitle: string;
  notebook?: NotebookResource;
}

export default function NotebookPanel({ topicTitle, notebook }: Props) {
  if (!notebook) {
    return (
      <div className="notebook-panel">
        <h4 className="ask-heading">Notes — {topicTitle}</h4>
        <p className="side-panel-empty">No notes uploaded for this topic yet.</p>
      </div>
    );
  }

  return (
    <div className="notebook-panel">
      <div className="notebook-head">
        <div>
          <h4 className="notebook-title">{notebook.title}</h4>
          <span className="notebook-meta">
            Uploaded by {notebook.uploadedBy} · {new Date(notebook.uploadedAt).toLocaleDateString()}
          </span>
        </div>
        <a className="notebook-open-link" href={notebook.fileUrl} target="_blank" rel="noreferrer">
          Open in new tab ↗
        </a>
      </div>

      <iframe className="notebook-pdf-frame" src={notebook.fileUrl} title={notebook.title} />
    </div>
  );
}
