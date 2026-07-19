import type { Chapter, Subject } from "../../data/mockDashboard";
import SubjectSwitcher from "./SubjectSwitcher";
import ChapterSidebar from "./ChapterSidebar";

interface Props {
  subjects: Subject[];
  selectedSubjectId: string;
  onSubjectChange: (subjectId: string) => void;
  chapters: Chapter[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function LeftPanel({
  subjects,
  selectedSubjectId,
  onSubjectChange,
  chapters,
  activeTopicId,
  onSelectTopic,
  mobileOpen,
  onCloseMobile,
}: Props) {
  return (
    <aside className={`left-panel ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="left-panel-mobile-head">
        <span className="left-panel-mobile-title">Menu</span>
        <button className="left-panel-close-btn" onClick={onCloseMobile} aria-label="Close menu">
          ✕
        </button>
      </div>

      <SubjectSwitcher
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onChange={onSubjectChange}
      />

      <ChapterSidebar
        chapters={chapters}
        activeTopicId={activeTopicId}
        onSelectTopic={onSelectTopic}
      />
    </aside>
  );
}
