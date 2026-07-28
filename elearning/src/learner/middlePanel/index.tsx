import type { ReactNode } from "react";
import { mockNotices, mockProgress } from "../../data/mockDashboard";
import type { MiddleView } from "../middleView";
import type { Chapter, SidebarAssignment } from "../types";
import ContentPanel from "../contentPanel";
import ProgressDetail from "../progressDetail";
import AssignmentDetail from "../assignmentDetail";
import AssignmentListView from "../assignmentListView";
import NoticeDetail from "../noticeDetail";
import NoticeListView from "../noticeListView";

interface Props {
  view: MiddleView;
  chapters: Chapter[];
  assignments: SidebarAssignment[];
  subjectId: string;
  subjectName: string;
  onNavigate: (view: MiddleView) => void;
  onClose: () => void;
}

export default function MiddlePanel({
  view,
  chapters,
  assignments,
  subjectId,
  subjectName,
  onNavigate,
  onClose,
}: Props) {
  let body: ReactNode = null;

  if (view.kind === "chapter") {
    const chapter = chapters.find((c) => c._id === view.chapterId) ?? chapters[0];
    body = <ContentPanel key={chapter?._id} chapter={chapter} />;
  } else if (view.kind === "progress") {
    body = <ProgressDetail subjectName={subjectName} stats={mockProgress[subjectId] ?? []} />;
  } else if (view.kind === "assignment") {
    const assignment = assignments.find((a) => a._id === view.assignmentId);
    body = assignment ? (
      <AssignmentDetail key={assignment._id} assignment={assignment} />
    ) : (
      <p className="side-panel-empty">Assignment not found.</p>
    );
  } else if (view.kind === "assignments-all") {
    body = (
      <AssignmentListView
        assignments={assignments}
        onSelect={(assignmentId) => onNavigate({ kind: "assignment", assignmentId })}
      />
    );
  } else if (view.kind === "notice") {
    const notice = mockNotices.find((n) => n.id === view.noticeId);
    body = notice ? (
      <NoticeDetail notice={notice} />
    ) : (
      <p className="side-panel-empty">Notice not found.</p>
    );
  } else if (view.kind === "notices-all") {
    const notices = mockNotices.filter((n) => n.subjectId === subjectId);
    body = (
      <NoticeListView
        notices={notices}
        onSelect={(noticeId) => onNavigate({ kind: "notice", noticeId })}
      />
    );
  }

  return (
    <section className="content-panel">
      {view.kind !== "chapter" && (
        <button className="middle-close-btn" onClick={onClose}>
          <span className="middle-close-icon">✕</span> Back to your lesson
        </button>
      )}
      {body}
    </section>
  );
}
