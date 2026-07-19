import type { Notice } from "../../data/mockDashboard";

interface Props {
  notices: Notice[];
  onSelect: (noticeId: string) => void;
}

export default function NoticeListView({ notices, onSelect }: Props) {
  return (
    <div className="list-view">
      <h2 className="detail-view-title">All Notices</h2>

      {notices.length === 0 ? (
        <p className="side-panel-empty">No notices for this subject yet.</p>
      ) : (
        <ul className="list-view-items">
          {notices.map((n) => (
            <li key={n.id}>
              <button className="list-view-item" onClick={() => onSelect(n.id)}>
                <span className="notice-title">{n.title}</span>
                <p className="list-view-item-desc">{n.message}</p>
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
