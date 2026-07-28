import { useState } from "react";
import "katex/dist/katex.min.css";
import type { Chapter } from "../types";
import ContentTabs, { type ContentTab } from "../contentTabs";
import LearningPanel from "../learningPanel";
import NotebookPanel from "../notebookPanel";
import PracticePanel from "../practicePanel";
import ChapterContentList from "./chapterContentList";
import ChapterAssignmentList from "./chapterAssignmentList";

interface Props {
  chapter: Chapter | undefined;
}

export default function ContentPanel({ chapter }: Props) {
  const [activeTab, setActiveTab] = useState<ContentTab>("content");

  if (!chapter) {
    return <p className="side-panel-empty">Select a chapter to get started.</p>;
  }

  return (
    <>
      <div className="content-panel-head">
        <ContentTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "content" && (
        <ChapterContentList items={chapter.chapterContent} />
      )}
      {activeTab === "video" && <LearningPanel videos={chapter.chapterVideo} />}
      {activeTab === "pdf" && <NotebookPanel pdfs={chapter.chapterPdf} />}
      {activeTab === "practice" && (
        <PracticePanel
          chapterTitle={chapter.chapterTitle}
          practice={chapter.chapterPractice}
        />
      )}
      {activeTab === "assignment" && (
        <ChapterAssignmentList items={chapter.chapterAssignment} />
      )}
    </>
  );
}
