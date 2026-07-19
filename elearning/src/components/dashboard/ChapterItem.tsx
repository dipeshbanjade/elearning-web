import type { Chapter } from "../../data/mockDashboard";

interface Props {
  chapter: Chapter;
  isOpen: boolean;
  activeTopicId: string;
  onToggle: () => void;
  onSelectTopic: (topicId: string) => void;
}

export default function ChapterItem({ chapter, isOpen, activeTopicId, onToggle, onSelectTopic }: Props) {
  return (
    <div className={`chapter-item ${isOpen ? "open" : ""}`}>
      <button className="chapter-head" onClick={onToggle}>
        <span className={`chapter-caret ${isOpen ? "open" : ""}`}>▸</span>
        <span className="chapter-title">{chapter.title}</span>
        <span className="chapter-count">{chapter.topics.length}</span>
      </button>

      {isOpen && (
        <div className="topic-list">
          {chapter.topics.map((topic) => (
            <button
              key={topic.id}
              className={`topic-item ${topic.id === activeTopicId ? "active" : ""}`}
              onClick={() => onSelectTopic(topic.id)}
            >
              <span className="topic-dot" />
              <span className="topic-name">{topic.title}</span>
              <span className="topic-duration">{topic.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
