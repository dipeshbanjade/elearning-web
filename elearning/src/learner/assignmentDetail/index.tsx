import type { SidebarAssignment } from "../types";

interface Props {
  assignment: SidebarAssignment;
}

export default function AssignmentDetail({ assignment }: Props) {
  return (
    <div className="detail-view">
      <div className="detail-view-top">
        <h2 className="detail-view-title">{assignment.title}</h2>
      </div>

      <div className="detail-view-meta">
        <span>{assignment.chapterTitle}</span>
        {assignment.deadline && (
          <span>Due {new Date(assignment.deadline).toLocaleDateString()}</span>
        )}
      </div>

      {assignment.hint && (
        <div
          className="detail-view-body"
          dangerouslySetInnerHTML={{ __html: assignment.hint }}
        />
      )}
    </div>
  );
}
