import { useState } from "react";
import { ASSIGNMENT_STATUS_LABEL } from "../../data/mockDashboard";
import type { Assignment } from "../../data/mockDashboard";

interface Props {
  assignment: Assignment;
}

export default function AssignmentDetail({ assignment }: Props) {
  const [status, setStatus] = useState(assignment.status);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitAssignment = () => {
    if (!answer.trim()) return;

    setSubmitting(true);
    // No backend yet — fake a short save before marking it done.
    setTimeout(() => {
      setStatus("done");
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="detail-view">
      <div className="detail-view-top">
        <h2 className="detail-view-title">{assignment.title}</h2>
        <span className={`assignment-status ${status}`}>{ASSIGNMENT_STATUS_LABEL[status]}</span>
      </div>

      <div className="detail-view-meta">
        <span>{assignment.chapterName}</span>
        <span>By {assignment.teacher}</span>
        <span>Due {assignment.dueDate}</span>
      </div>

      <p className="detail-view-body">{assignment.description}</p>

      {status === "done" ? (
        <div className="assignment-submitted">
          <span className="assignment-submitted-icon">✓</span>
          You've submitted this assignment.
        </div>
      ) : (
        <div className="assignment-submit-box">
          <h4 className="ask-heading">Your answer</h4>
          <textarea
            className="assignment-answer-textarea"
            placeholder="Write your answer here…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            className="assignment-submit-btn"
            onClick={submitAssignment}
            disabled={!answer.trim() || submitting}
          >
            {submitting ? "Submitting…" : "Submit Assignment"}
          </button>
        </div>
      )}
    </div>
  );
}
