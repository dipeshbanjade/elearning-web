import type { Notice } from "../../data/mockDashboard";

const PREVIEW_LIMIT = 3;

interface Props {
  notices: Notice[];
  onSelect: (noticeId: string) => void;
  onViewAll: () => void;
}

export default function NoticePanel({ notices, onSelect, onViewAll }: Props) {
  const preview = notices.slice(0, PREVIEW_LIMIT);

  return (
    <div className="notice-panel">
      <div className="side-panel-head">
        <h3 className="side-panel-heading">Notice</h3>
        {notices.length > 0 && (
          <button className="view-all-btn" onClick={onViewAll}>
            View all ({notices.length})
          </button>
        )}
      </div>

      {notices.length === 0 ? (
        <p className="side-panel-empty">No notices for this subject yet.</p>
      ) : (
        <ul className="notice-list">
          {preview.map((n) => (
            <li key={n.id}>
              <button className="notice-item" onClick={() => onSelect(n.id)}>
                <span className="notice-title">{n.title}</span>
                <div className="notice-bottom">
                  <span>{n.teacher}</span>
                  <span>{new Date(n.postedAt).toLocaleDateString()}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
