import type { Topic } from "../../data/mockDashboard";
import { mockPractice } from "../../data/mockDashboard";
import PracticeQuestionCard from "./PracticeQuestionCard";

interface Props {
  topic: Topic;
}

export default function PracticePanel({ topic }: Props) {
  const questions = mockPractice[topic.id] ?? [];

  return (
    <div className="practice-panel" key={topic.id}>
      <h2 className="practice-title">{topic.title} — Practice</h2>

      {questions.length === 0 ? (
        <p className="practice-empty">No practice questions for this topic yet.</p>
      ) : (
        questions.map((q, i) => <PracticeQuestionCard key={q.id} question={q} index={i} />)
      )}
    </div>
  );
}
