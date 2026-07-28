import type { ChapterPracticeItem } from "../types";
import PracticeQuestionCard from "../practiceQuestionCard";

interface Props {
  chapterTitle: string;
  practice: ChapterPracticeItem[];
}

export default function PracticePanel({ chapterTitle, practice }: Props) {
  return (
    <div className="practice-panel">
      <h2 className="practice-title">{chapterTitle} — Practice</h2>

      {practice.length === 0 ? (
        <p className="practice-empty">No practice questions for this chapter yet.</p>
      ) : (
        practice.map((q, i) => (
          <PracticeQuestionCard key={q._id} question={q} index={i} />
        ))
      )}
    </div>
  );
}
