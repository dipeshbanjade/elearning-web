import type { Chapter } from "../types";
import ChapterItem from "../chapterItem";

interface Props {
  chapters: Chapter[];
  activeChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
}

export default function ChapterSidebar({
  chapters,
  activeChapterId,
  onSelectChapter,
}: Props) {
  return (
    <div className="chapter-sidebar">
      <h3 className="sidebar-heading">Chapters</h3>

      <div className="chapter-list">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter._id}
            chapter={chapter}
            isActive={chapter._id === activeChapterId}
            onSelect={() => onSelectChapter(chapter._id)}
          />
        ))}

        {chapters.length === 0 && (
          <p className="side-panel-empty">No chapters available yet.</p>
        )}
      </div>
    </div>
  );
}
