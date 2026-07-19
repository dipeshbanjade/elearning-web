import { useState } from "react";
import type { Chapter } from "../../data/mockDashboard";
import ChapterItem from "./ChapterItem";

interface Props {
  chapters: Chapter[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

export default function ChapterSidebar({ chapters, activeTopicId, onSelectTopic }: Props) {
  const [openChapterId, setOpenChapterId] = useState(chapters[0]?.id ?? "");

  const toggleChapter = (chapterId: string) => {
    setOpenChapterId((current) => (current === chapterId ? "" : chapterId));
  };

  return (
    <div className="chapter-sidebar">
      <h3 className="sidebar-heading">Chapters</h3>

      <div className="chapter-list">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            isOpen={chapter.id === openChapterId}
            activeTopicId={activeTopicId}
            onToggle={() => toggleChapter(chapter.id)}
            onSelectTopic={onSelectTopic}
          />
        ))}
      </div>
    </div>
  );
}
