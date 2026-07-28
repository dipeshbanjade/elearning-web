import { useState } from "react";
import type { ChapterPracticeItem } from "../types";

interface Props {
  question: ChapterPracticeItem;
  index: number;
}

export default function PracticeQuestionCard({ question, index }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const pick = (option: string) => {
    if (selected !== null) return; // lock after first answer
    setSelected(option);
  };

  return (
    <div className="practice-card">
      <p className="practice-question">
        <span className="practice-number">Q{index + 1}.</span>{" "}
        <span dangerouslySetInnerHTML={{ __html: question.question }} />
      </p>

      <div className="practice-options">
        {question.option.map((option, i) => {
          const isCorrect = option.trim() === question.answer.trim();
          const isChosen = option === selected;
          let state = "";
          if (selected !== null) {
            if (isCorrect) state = "correct";
            else if (isChosen) state = "wrong";
          }

          return (
            <button
              key={i}
              className={`practice-option ${state}`}
              onClick={() => pick(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
