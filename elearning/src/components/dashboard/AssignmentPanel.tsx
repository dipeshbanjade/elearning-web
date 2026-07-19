import { ASSIGNMENT_STATUS_LABEL } from "../../data/mockDashboard";
import type { Assignment } from "../../data/mockDashboard";

const PREVIEW_LIMIT = 3;

interface Props {
  assignments: Assignment[];
  onSelect: (assignmentId: string) => void;
  onViewAll: () => void;
}

export default function AssignmentPanel({ assignments, onSelect, onViewAll }: Props) {
  const preview = assignments.slice(0, PREVIEW_LIMIT);

  return (
    <div className="assignment-panel">
      <div className="side-panel-head">
        <h3 className="side-panel-heading">Assignments</h3>
        {assignments.length > 0 && (
          <button className="view-all-btn" onClick={onViewAll}>
            View all ({assignments.length})
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <p className="side-panel-empty">No assignments for this subject yet.</p>
      ) : (
        <ul className="assignment-list">
          {preview.map((a) => (
            <li key={a.id}>
              <button className="assignment-item" onClick={() => onSelect(a.id)}>
                <div className="assignment-item-top">
                  <span className="assignment-title">{a.title}</span>
                  <span className={`assignment-status ${a.status}`}>
                    {ASSIGNMENT_STATUS_LABEL[a.status]}
                  </span>
                </div>
                <p className="assignment-chapter">{a.chapterName}</p>
                <div className="assignment-item-bottom">
                  <span>By {a.teacher}</span>
                  <span>Due {a.dueDate}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
