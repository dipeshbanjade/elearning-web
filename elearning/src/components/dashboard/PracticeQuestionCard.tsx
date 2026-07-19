import { useState } from "react";
import type { PracticeQuestion } from "../../data/mockDashboard";

interface Props {
  question: PracticeQuestion;
  index: number;
}

export default function PracticeQuestionCard({ question, index }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (optionIndex: number) => {
    if (selected !== null) return; // lock after first answer
    setSelected(optionIndex);
  };

  return (
    <div className="practice-card">
      <p className="practice-question">
        <span className="practice-number">Q{index + 1}.</span> {question.question}
      </p>

      <div className="practice-options">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === selected;
          let state = "";
          if (selected !== null) {
            if (isCorrect) state = "correct";
            else if (isChosen) state = "wrong";
          }

          return (
            <button
              key={i}
              className={`practice-option ${state}`}
              onClick={() => pick(i)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && <p className="practice-explanation">{question.explanation}</p>}
    </div>
  );
}
