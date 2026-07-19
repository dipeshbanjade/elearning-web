export type ContentTab = "learning" | "practice" | "notebook";

interface Props {
  activeTab: ContentTab;
  onChange: (tab: ContentTab) => void;
}

export default function ContentTabs({ activeTab, onChange }: Props) {
  return (
    <div className="content-tabs">
      <button
        className={`content-tab ${activeTab === "learning" ? "active" : ""}`}
        onClick={() => onChange("learning")}
      >
        Learning
      </button>
      <button
        className={`content-tab ${activeTab === "practice" ? "active" : ""}`}
        onClick={() => onChange("practice")}
      >
        Practice
      </button>
      <button
        className={`content-tab ${activeTab === "notebook" ? "active" : ""}`}
        onClick={() => onChange("notebook")}
      >
        Notebook
      </button>
    </div>
  );
}
