import type { ProgressStat } from "../../data/mockDashboard";

interface Props {
  subjectName: string;
  stats: ProgressStat[];
}

export default function ProgressDetail({ subjectName, stats }: Props) {
  return (
    <div className="progress-detail">
      <h2 className="detail-view-title">My Progress — {subjectName}</h2>

      {stats.length === 0 ? (
        <p className="side-panel-empty">No progress tracked for this subject yet.</p>
      ) : (
        <div className="progress-detail-list">
          {stats.map((s) => (
            <div key={s.id} className="progress-detail-item">
              <div className="progress-detail-top">
                <span className="progress-detail-label">{s.label}</span>
                <span className="progress-detail-value">{s.value}%</span>
              </div>
              <div className="progress-bar-track lg">
                <div className="progress-bar-fill" style={{ width: `${s.value}%` }} />
              </div>
              <p className="progress-detail-note">{s.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
