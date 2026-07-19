import type { ReactNode } from "react";
import type { Subject } from "../../data/mockDashboard";
import { mockAssignments, mockNotices, mockProgress } from "../../data/mockDashboard";
import type { MiddleView } from "./middleView";
import ContentPanel from "./ContentPanel";
import ProgressDetail from "./ProgressDetail";
import AssignmentDetail from "./AssignmentDetail";
import AssignmentListView from "./AssignmentListView";
import NoticeDetail from "./NoticeDetail";
import NoticeListView from "./NoticeListView";

interface Props {
  view: MiddleView;
  subject: Subject;
  onNavigate: (view: MiddleView) => void;
  onClose: () => void;
}

function findTopic(subject: Subject, topicId: string) {
  for (const chapter of subject.chapters) {
    const topic = chapter.topics.find((t) => t.id === topicId);
    if (topic) return topic;
  }
  return undefined;
}

export default function MiddlePanel({ view, subject, onNavigate, onClose }: Props) {
  let body: ReactNode = null;

  if (view.kind === "topic") {
    const topic = findTopic(subject, view.topicId) ?? subject.chapters[0]?.topics[0];
    body = topic ? (
      <ContentPanel key={topic.id} topic={topic} />
    ) : (
      <p className="side-panel-empty">This subject has no topics yet.</p>
    );
  } else if (view.kind === "progress") {
    body = <ProgressDetail subjectName={subject.name} stats={mockProgress[subject.id] ?? []} />;
  } else if (view.kind === "assignment") {
    const assignment = mockAssignments.find((a) => a.id === view.assignmentId);
    body = assignment ? (
      <AssignmentDetail key={assignment.id} assignment={assignment} />
    ) : (
      <p className="side-panel-empty">Assignment not found.</p>
    );
  } else if (view.kind === "assignments-all") {
    const assignments = mockAssignments.filter((a) => a.subjectId === subject.id);
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
    const notices = mockNotices.filter((n) => n.subjectId === subject.id);
    body = (
      <NoticeListView
        notices={notices}
        onSelect={(noticeId) => onNavigate({ kind: "notice", noticeId })}
      />
    );
  }

  return (
    <section className="content-panel">
      {view.kind !== "topic" && (
        <button className="middle-close-btn" onClick={onClose}>
          <span className="middle-close-icon">✕</span> Back to your lesson
        </button>
      )}
      {body}
    </section>
  );
}
