import type { ProgressStat } from "../../data/mockDashboard";
import { mockNotices } from "../../data/mockDashboard";
import type { SidebarAssignment } from "../types";
import ProgressPanel from "../progressPanel";
import AssignmentPanel from "../assignmentPanel";
import NoticePanel from "../noticePanel";

interface Props {
  subjectId: string;
  progress: ProgressStat[];
  assignments: SidebarAssignment[];
  onOpenProgress: () => void;
  onOpenAssignment: (assignmentId: string) => void;
  onOpenAllAssignments: () => void;
  onOpenNotice: (noticeId: string) => void;
  onOpenAllNotices: () => void;
}

export default function RightPanel({
  subjectId,
  progress,
  assignments,
  onOpenProgress,
  onOpenAssignment,
  onOpenAllAssignments,
  onOpenNotice,
  onOpenAllNotices,
}: Props) {
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
