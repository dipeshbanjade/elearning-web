import { useState } from "react";
import type { Topic } from "../../data/mockDashboard";
import { mockNotebooks } from "../../data/mockDashboard";
import ContentTabs, { type ContentTab } from "./ContentTabs";
import LearningPanel from "./LearningPanel";
import PracticePanel from "./PracticePanel";
import NotebookPanel from "./NotebookPanel";

interface Props {
  topic: Topic;
}

export default function ContentPanel({ topic }: Props) {
  const [activeTab, setActiveTab] = useState<ContentTab>("learning");

  return (
    <>
      <div className="content-panel-head">
        <ContentTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "learning" && <LearningPanel topic={topic} />}
      {activeTab === "practice" && <PracticePanel topic={topic} />}
      {activeTab === "notebook" && (
        <NotebookPanel topicTitle={topic.title} notebook={mockNotebooks[topic.id]} />
      )}
    </>
  );
}
