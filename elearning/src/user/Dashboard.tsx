import { useEffect, useMemo, useState } from "react";
import { mockSubjects, mockProgress } from "../data/mockDashboard";
import LeftPanel from "../components/dashboard/LeftPanel";
import MiddlePanel from "../components/dashboard/MiddlePanel";
import RightPanel from "../components/dashboard/RightPanel";
import type { MiddleView } from "../components/dashboard/middleView";

export default function Dashboard() {
  const [selectedSubjectId, setSelectedSubjectId] = useState(mockSubjects[0].id);

  const selectedSubject = useMemo(
    () => mockSubjects.find((s) => s.id === selectedSubjectId) ?? mockSubjects[0],
    [selectedSubjectId],
  );

  const firstTopicId = selectedSubject.chapters[0]?.topics[0]?.id ?? "";
  const [view, setView] = useState<MiddleView>({ kind: "topic", topicId: firstTopicId });

  // What the learner was actually studying — kept around separately so the
  // chapter list still highlights it, and the close button knows where to
  // send them back to, even while progress/assignment/notice is open.
  const [lastTopicId, setLastTopicId] = useState(firstTopicId);

  // On mobile the chapter list lives off-screen as a drawer instead of
  // stacking above the lesson — closed by default so the lesson is what
  // you land on.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stop the page underneath from scrolling while the drawer is open,
  // otherwise it can shift behind the backdrop while it's sliding shut.
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSubjectChange = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    const topicId = subject?.chapters[0]?.topics[0]?.id ?? "";
    setSelectedSubjectId(subjectId);
    setView({ kind: "topic", topicId });
    setLastTopicId(topicId);
  };

  const handleSelectTopic = (topicId: string) => {
    setView({ kind: "topic", topicId });
    setLastTopicId(topicId);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-page">
      <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
        <span className="mobile-toggle-icon">☰</span> Chapters
      </button>

      <div className="dashboard-grid">
        <div
          className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <LeftPanel
          key={`left-${selectedSubject.id}`}
          subjects={mockSubjects}
          selectedSubjectId={selectedSubjectId}
          onSubjectChange={handleSubjectChange}
          chapters={selectedSubject.chapters}
          activeTopicId={lastTopicId}
          onSelectTopic={handleSelectTopic}
          mobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <MiddlePanel
          view={view}
          subject={selectedSubject}
          onNavigate={setView}
          onClose={() => setView({ kind: "topic", topicId: lastTopicId })}
        />

        <RightPanel
          key={`right-${selectedSubject.id}`}
          subjectId={selectedSubject.id}
          progress={mockProgress[selectedSubject.id] ?? []}
          onOpenProgress={() => setView({ kind: "progress" })}
          onOpenAssignment={(assignmentId) => setView({ kind: "assignment", assignmentId })}
          onOpenAllAssignments={() => setView({ kind: "assignments-all" })}
          onOpenNotice={(noticeId) => setView({ kind: "notice", noticeId })}
          onOpenAllNotices={() => setView({ kind: "notices-all" })}
        />
      </div>
    </div>
  );
}
