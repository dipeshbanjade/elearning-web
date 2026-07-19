import type { ProgressStat } from "../../data/mockDashboard";
import { mockAssignments, mockNotices } from "../../data/mockDashboard";
import ProgressPanel from "./ProgressPanel";
import AssignmentPanel from "./AssignmentPanel";
import NoticePanel from "./NoticePanel";

interface Props {
  subjectId: string;
  progress: ProgressStat[];
  onOpenProgress: () => void;
  onOpenAssignment: (assignmentId: string) => void;
  onOpenAllAssignments: () => void;
  onOpenNotice: (noticeId: string) => void;
  onOpenAllNotices: () => void;
}

export default function RightPanel({
  subjectId,
  progress,
  onOpenProgress,
  onOpenAssignment,
  onOpenAllAssignments,
  onOpenNotice,
  onOpenAllNotices,
}: Props) {
  const assignments = mockAssignments.filter((a) => a.subjectId === subjectId);
  const notices = mockNotices.filter((n) => n.subjectId === subjectId);

  return (
    <aside className="right-panel">
      <ProgressPanel stats={progress} onOpen={onOpenProgress} />
      <AssignmentPanel
        assignments={assignments}
        onSelect={onOpenAssignment}
        onViewAll={onOpenAllAssignments}
      />
      <NoticePanel notices={notices} onSelect={onOpenNotice} onViewAll={onOpenAllNotices} />
    </aside>
  );
}
