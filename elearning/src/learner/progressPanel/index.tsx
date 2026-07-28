import type { ProgressStat } from "../../data/mockDashboard";

interface Props {
  stats: ProgressStat[];
  onOpen: () => void;
}

export default function ProgressPanel({ stats, onOpen }: Props) {
  return (
    <div className="progress-panel">
      <div className="progress-panel-head">
        <h3 className="side-panel-heading">My Progress</h3>
        <button className="progress-view-btn" onClick={onOpen}>
          View details →
        </button>
      </div>

      {stats.length === 0 ? (
        <p className="side-panel-empty">No progress tracked for this subject yet.</p>
      ) : (
        <div className="progress-mini-list">
          {stats.map((s) => (
            <div key={s.id} className="progress-mini-item">
              <div className="progress-mini-top">
                <span>{s.label}</span>
                <span>{s.value}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
