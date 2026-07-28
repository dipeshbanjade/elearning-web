import type { ChapterPdfItem } from "../types";

interface Props {
  pdfs: ChapterPdfItem[];
}

export default function NotebookPanel({ pdfs }: Props) {
  if (pdfs.length === 0) {
    return (
      <div className="notebook-panel">
        <p className="side-panel-empty">No PDFs uploaded for this chapter yet.</p>
      </div>
    );
  }

  return (
    <div className="notebook-panel">
      {pdfs.map((pdf) => (
        <div className="notebook-item" key={pdf._id}>
          <div className="notebook-head">
            <h4 className="notebook-title">{pdf.title ?? "Untitled PDF"}</h4>
            {pdf.file?.url && (
              <a
                className="notebook-open-link"
                href={pdf.file.url}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab ↗
              </a>
            )}
          </div>

          {pdf.file?.url && (
            <iframe
              className="notebook-pdf-frame"
              src={pdf.file.url}
              title={pdf.title ?? "PDF"}
            />
          )}
        </div>
      ))}
    </div>
  );
}
