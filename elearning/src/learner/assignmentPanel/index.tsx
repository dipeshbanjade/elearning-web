import type { SidebarAssignment } from "../types";

const PREVIEW_LIMIT = 3;

interface Props {
  assignments: SidebarAssignment[];
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
        <p className="side-panel-empty">No upcoming assignments.</p>
      ) : (
        <ul className="assignment-list">
          {preview.map((a) => (
            <li key={a._id}>
              <button className="assignment-item" onClick={() => onSelect(a._id)}>
                <div className="assignment-item-top">
                  <span className="assignment-title">{a.title}</span>
                </div>
                <p className="assignment-chapter">{a.chapterTitle}</p>
                {a.deadline && (
                  <div className="assignment-item-bottom">
                    <span>Due {new Date(a.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
