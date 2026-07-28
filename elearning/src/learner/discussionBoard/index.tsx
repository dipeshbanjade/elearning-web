import { useState } from "react";
import type { DiscussionMessage } from "../../data/mockDashboard";

interface Props {
  videoId: string;
  messages: DiscussionMessage[];
}

export default function DiscussionBoard({ videoId, messages }: Props) {
  const [list, setList] = useState<DiscussionMessage[]>(messages);
  const [draft, setDraft] = useState("");

  const postMessage = () => {
    const text = draft.trim();
    if (!text) return;

    const newMessage: DiscussionMessage = {
      id: `local-${Date.now()}`,
      author: "You",
      role: "student",
      message: text,
      postedAt: new Date().toISOString(),
    };

    setList((prev) => [...prev, newMessage]);
    setDraft("");
  };

  return (
    <div className="discussion-board" key={videoId}>
      <h4 className="discussion-heading">Discussion board</h4>

      {list.length === 0 ? (
        <p className="discussion-empty">No messages yet. Start the discussion.</p>
      ) : (
        <ul className="discussion-list">
          {list.map((m) => (
            <li key={m.id} className={`discussion-item ${m.role}`}>
              <span className="discussion-avatar">{m.author.charAt(0).toUpperCase()}</span>
              <div className="discussion-body">
                <div className="discussion-author-row">
                  <span className="discussion-author">{m.author}</span>
                  {m.role === "teacher" && <span className="discussion-badge">Teacher</span>}
                </div>
                <p className="discussion-text">{m.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="discussion-input-row">
        <input
          className="discussion-input"
          placeholder="Write something to the class…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && postMessage()}
        />
        <button className="discussion-post-btn" onClick={postMessage} disabled={!draft.trim()}>
          Post
        </button>
      </div>
    </div>
  );
}
