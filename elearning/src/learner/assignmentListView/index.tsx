import type { SidebarAssignment } from "../types";

interface Props {
  assignments: SidebarAssignment[];
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
            <li key={a._id}>
              <button className="list-view-item" onClick={() => onSelect(a._id)}>
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
