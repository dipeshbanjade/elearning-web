import type { Chapter, SubjectListItem } from "../types";
import SubjectSwitcher from "../subjectSwitcher";
import ChapterSidebar from "../chapterSidebar";

interface Props {
  subjectList: SubjectListItem[];
  selectedSubjectId: string | null;
  onSubjectChange: (subjectId: string) => void;
  chapters: Chapter[];
  activeChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function LeftPanel({
  subjectList,
  selectedSubjectId,
  onSubjectChange,
  chapters,
  activeChapterId,
  onSelectChapter,
  mobileOpen,
  onCloseMobile,
}: Props) {
  return (
    <aside className={`left-panel ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="left-panel-mobile-head">
        <span className="left-panel-mobile-title">Menu</span>
        <button
          className="left-panel-close-btn"
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <SubjectSwitcher
        subjectList={subjectList}
        selectedSubjectId={selectedSubjectId}
        onChange={onSubjectChange}
      />

      <ChapterSidebar
        chapters={chapters}
        activeChapterId={activeChapterId}
        onSelectChapter={onSelectChapter}
      />
    </aside>
  );
}
