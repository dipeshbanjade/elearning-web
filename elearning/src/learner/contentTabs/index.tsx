export type ContentTab =
  | "content"
  | "video"
  | "pdf"
  | "practice"
  | "assignment";

interface Props {
  activeTab: ContentTab;
  onChange: (tab: ContentTab) => void;
}

export default function ContentTabs({ activeTab, onChange }: Props) {
  return (
    <div className="content-tabs">
      <button
        className={`content-tab ${activeTab === "content" ? "active" : ""}`}
        onClick={() => onChange("content")}
      >
        <span className="content-tab-icon">📁</span>
        Content
      </button>
      <button
        className={`content-tab ${activeTab === "video" ? "active" : ""}`}
        onClick={() => onChange("video")}
      >
        <span className="content-tab-icon">📁</span>
        Video
      </button>
      <button
        className={`content-tab ${activeTab === "pdf" ? "active" : ""}`}
        onClick={() => onChange("pdf")}
      >
        <span className="content-tab-icon">📁</span>
        Book
      </button>
      <button
        className={`content-tab ${activeTab === "practice" ? "active" : ""}`}
        onClick={() => onChange("practice")}
      >
        <span className="content-tab-icon">📁</span>
        Practice
      </button>
      <button
        className={`content-tab ${activeTab === "assignment" ? "active" : ""}`}
        onClick={() => onChange("assignment")}
      >
        <span className="content-tab-icon">📁</span>
        Assignment
      </button>
    </div>
  );
}
