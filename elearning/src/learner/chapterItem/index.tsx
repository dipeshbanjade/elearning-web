import type { Chapter } from "../types";

interface Props {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
}

export default function ChapterItem({ chapter, isActive, onSelect }: Props) {
  return (
    <div className={`chapter-item ${isActive ? "active" : ""}`}>
      <button className="chapter-head" onClick={onSelect}>
        <span className="chapter-title">{chapter.chapterTitle}</span>
        <span className="chapter-count">{chapter.chapterVideo.length}</span>
      </button>
    </div>
  );
}
