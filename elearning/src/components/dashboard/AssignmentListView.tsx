import { ASSIGNMENT_STATUS_LABEL } from "../../data/mockDashboard";
import type { Assignment } from "../../data/mockDashboard";

interface Props {
  assignments: Assignment[];
  onSelect: (assignmentId: string) => void;
}

export default function AssignmentListView({ assignments, onSelect }: Props) {
  return (
    <div className="list-view">
      <h2 className="detail-view-title">All Assignments</h2>

      {assignments.length === 0 ? (
        <p className="side-panel-empty">No assignments for this subject yet.</p>
      ) : (
        <ul className="list-view-items">
          {assignments.map((a) => (
            <li key={a.id}>
              <button className="list-view-item" onClick={() => onSelect(a.id)}>
                <div className="assignment-item-top">
                  <span className="assignment-title">{a.title}</span>
                  <span className={`assignment-status ${a.status}`}>
                    {ASSIGNMENT_STATUS_LABEL[a.status]}
                  </span>
                </div>
                <p className="assignment-chapter">{a.chapterName}</p>
                <p className="list-view-item-desc">{a.description}</p>
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
