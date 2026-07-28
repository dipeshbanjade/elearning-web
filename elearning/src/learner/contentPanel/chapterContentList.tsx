import { useState } from "react";
import type { ChapterContentItem } from "../types";

interface Props {
  items: ChapterContentItem[];
}

export default function ChapterContentList({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?._id ?? null);

  if (items.length === 0) {
    return <p className="side-panel-empty">No written content for this chapter yet.</p>;
  }

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="chapter-content-list">
      {items.map((item) => {
        const isOpen = item._id === openId;
        return (
          <div className="chapter-content-item" key={item._id}>
            <button className="chapter-content-head" onClick={() => toggle(item._id)}>
              <h4 className="chapter-content-title">{item.title}</h4>
              <span className="chapter-content-toggle">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div
                className="chapter-content-body"
                dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
