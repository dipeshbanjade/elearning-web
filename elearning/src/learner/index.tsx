import { useEffect, useState } from "react";
import { mockProgress } from "../data/mockDashboard";
import LeftPanel from "./leftPanel";
import MiddlePanel from "./middlePanel";
import RightPanel from "./rightPanel";
import type { MiddleView } from "./middleView";
import learnerApi from "../api/learner";
import { getStoredUser } from "../helper/helper";
import Loading from "../helper/Loading";
import type { Chapter, SidebarAssignment, SubjectListItem } from "./types";

interface InitData {
  subjectList?: SubjectListItem[];
  selectedSubjectId?: string;
  chapters: Chapter[];
}

export default function Dashboard() {
  // Seeded once from whatever was cached at login, so the list isn't
  // empty on first render. The init fetch below refreshes it with the
  // live server copy right after mount.
  const [subjectList, setSubjectList] = useState<SubjectListItem[]>(
    () => (getStoredUser()?.subjectList as SubjectListItem[] | undefined) ?? [],
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // What the learner was actually studying — kept around separately so the
  // chapter list still highlights it, and the close button knows where to
  // send them back to, even while progress/assignment/notice is open.
  const [lastChapterId, setLastChapterId] = useState<string | null>(null);

  const [view, setView] = useState<MiddleView>({
    kind: "chapter",
    chapterId: "",
  });
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const applyInitData = (data: InitData) => {
    if (data.subjectList) setSubjectList(data.subjectList);
    setChapters(data.chapters);
    const firstChapter = data.chapters[0];
    setSelectedSubjectId(
      data.selectedSubjectId ?? firstChapter?.subSubCategoryId ?? null,
    );
    const firstChapterId = firstChapter?._id ?? null;
    setLastChapterId(firstChapterId);
    setView({ kind: "chapter", chapterId: firstChapterId ?? "" });
  };

  // Runs once on mount — no subjectId, so the backend resolves a sane
  // default subject on its own.
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setInitLoading(true);
        const res = await learnerApi.fetchLearnerinitData();
        if (!ignore && res?.data) applyInitData(res.data);
      } catch (error) {
        if (!ignore) setInitError("Could not load your subjects.");
        console.error(error);
      } finally {
        if (!ignore) setInitLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

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

  const handleSubjectChange = async (subjectId: string) => {
    try {
      setInitLoading(true);
      const res = await learnerApi.fetchLearnerinitData(subjectId);
      if (res?.data) applyInitData(res.data);
      setSidebarOpen(false);
    } catch (error) {
      setInitError("Could not switch subjects.");
      console.error(error);
    } finally {
      setInitLoading(false);
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    setView({ kind: "chapter", chapterId });
    setLastChapterId(chapterId);
    setSidebarOpen(false);
  };

  if (initLoading) return <Loading />;

  if (initError) {
    return (
      <div className="dashboard-page">
        <p className="side-panel-empty">{initError}</p>
      </div>
    );
  }

  const subjectName =
    subjectList.find((s) => s._id === selectedSubjectId)?.name ?? "";

  // Every assignment across the subject's chapters, tagged with which
  // chapter it belongs to — used for both the full assignment list and the
  // sidebar's "upcoming only" preview below.
  const allAssignments: SidebarAssignment[] = chapters.flatMap((chapter) =>
    chapter.chapterAssignment.map((assignment) => ({
      ...assignment,
      chapterTitle: chapter.chapterTitle,
    })),
  );

  const now = new Date();
  const sidebarAssignment = allAssignments.filter(
    (assignment) => assignment.deadline && new Date(assignment.deadline) >= now,
  );

  return (
    <div className="dashboard-page">
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="mobile-toggle-icon">☰</span> Chapters
      </button>

      <div className="dashboard-grid">
        <div
          className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <LeftPanel
          key={`left-${selectedSubjectId}`}
          subjectList={subjectList}
          selectedSubjectId={selectedSubjectId}
          onSubjectChange={handleSubjectChange}
          chapters={chapters}
          activeChapterId={lastChapterId}
          onSelectChapter={handleSelectChapter}
          mobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <MiddlePanel
          view={view}
          chapters={chapters}
          assignments={allAssignments}
          subjectId={selectedSubjectId ?? ""}
          subjectName={subjectName}
          onNavigate={setView}
          onClose={() =>
            setView({ kind: "chapter", chapterId: lastChapterId ?? "" })
          }
        />

        <RightPanel
          key={`right-${selectedSubjectId}`}
          subjectId={selectedSubjectId ?? ""}
          progress={mockProgress[selectedSubjectId ?? ""] ?? []}
          assignments={sidebarAssignment}
          onOpenProgress={() => setView({ kind: "progress" })}
          onOpenAssignment={(assignmentId) =>
            setView({ kind: "assignment", assignmentId })
          }
          onOpenAllAssignments={() => setView({ kind: "assignments-all" })}
          onOpenNotice={(noticeId) => setView({ kind: "notice", noticeId })}
          onOpenAllNotices={() => setView({ kind: "notices-all" })}
        />
      </div>
    </div>
  );
}
