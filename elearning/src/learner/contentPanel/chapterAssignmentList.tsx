import type { ChapterAssignmentItem } from "../types";

interface Props {
  items: ChapterAssignmentItem[];
}

export default function ChapterAssignmentList({ items }: Props) {
  if (items.length === 0) {
    return <p className="side-panel-empty">No assignments for this chapter yet.</p>;
  }

  return (
    <div className="chapter-assignment-list">
      {items.map((item) => (
        <div className="chapter-assignment-item" key={item._id}>
          <div className="chapter-assignment-head">
            <h4 className="chapter-assignment-title">{item.title}</h4>
            {item.deadline && (
              <span className="chapter-assignment-deadline">
                Due {new Date(item.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
          {item.hint && (
            <div
              className="chapter-assignment-hint"
              dangerouslySetInnerHTML={{ __html: item.hint }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
