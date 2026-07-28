import { useState } from "react";
import type { VideoQuestion } from "../../data/mockDashboard";

interface Props {
  videoId: string;
  questions: VideoQuestion[];
}

export default function AskQuestionBox({ videoId, questions }: Props) {
  const [list, setList] = useState<VideoQuestion[]>(questions);
  const [draft, setDraft] = useState("");

  const submitQuestion = () => {
    const text = draft.trim();
    if (!text) return;

    const newQuestion: VideoQuestion = {
      id: `local-${Date.now()}`,
      askedBy: "You",
      question: text,
      askedAt: new Date().toISOString(),
    };

    setList((prev) => [newQuestion, ...prev]);
    setDraft("");
  };

  return (
    <div className="ask-question-box" key={videoId}>
      <h4 className="ask-heading">Ask about this video</h4>

      <div className="ask-input-row">
        <textarea
          className="ask-textarea"
          placeholder="Type your question about the video…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="ask-submit-btn" onClick={submitQuestion} disabled={!draft.trim()}>
          Ask
        </button>
      </div>

      {list.length === 0 ? (
        <p className="ask-empty">No questions yet — be the first to ask.</p>
      ) : (
        <ul className="ask-list">
          {list.map((q) => (
            <li key={q.id} className="ask-item">
              <div className="ask-item-question">
                <span className="ask-item-author">{q.askedBy}</span>
                {q.question}
              </div>
              {q.answer && (
                <div className="ask-item-answer">
                  <span className="ask-item-answer-tag">Answer</span>
                  {q.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
