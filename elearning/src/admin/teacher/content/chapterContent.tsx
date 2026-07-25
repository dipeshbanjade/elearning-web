import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import teacherRoute, { type ChapterDetail } from "../teacherRoute";
import Loading from "../../../helper/Loading";
import ContentBody from "./contentBody";
import VideoContent from "./videoContent";
import PdfContent from "./pdfContent";
import PracticeQuestion from "./practiceQuestion";
import AssignmentContent from "./assignmentContent";

type DetailTab = "content" | "video" | "pdf" | "assignment" | "practice";

export default function ChapterContent() {
  const { chapterId } = useParams<{ id: string; chapterId: string }>();
  if (!chapterId) return null;

  return <ChapterContentBody key={chapterId} chapterId={chapterId} />;
}

function ChapterContentBody({ chapterId }: { chapterId: string }) {
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>("content");

  const loadChapter = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teacherRoute.fetchChapterById(chapterId);
      setChapter(res?.data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await loadChapter();
    })();
    return () => {
      ignore = true;
    };
  }, [loadChapter]);

  if (loading) return <Loading />;

  if (!chapter) {
    return (
      <div>
        <h1 className="page-title">Chapter</h1>
        <p className="text-muted">This chapter could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => navigate(-1)}
      >
        ‹ Back to chapters
      </button>

      <div className="chapter-detail-panel">
        <h1 className="page-title mb-3">{chapter.chapterTitle}</h1>

        <ul className="nav nav-tabs chapter-nav-tabs">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "content" ? "active" : ""}`}
              onClick={() => setActiveTab("content")}
            >
              <span className="chapter-tab-icon">📁</span>
              Content
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "video" ? "active" : ""}`}
              onClick={() => setActiveTab("video")}
            >
              <span className="chapter-tab-icon">📁</span>
              Video
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "pdf" ? "active" : ""}`}
              onClick={() => setActiveTab("pdf")}
            >
              <span className="chapter-tab-icon">📁</span>
              PDF / Book
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "practice" ? "active" : ""}`}
              onClick={() => setActiveTab("practice")}
            >
              <span className="chapter-tab-icon">📁</span>
              Practice Question
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "assignment" ? "active" : ""}`}
              onClick={() => setActiveTab("assignment")}
            >
              <span className="chapter-tab-icon">📁</span>
              Assignment
            </button>
          </li>
        </ul>

        <div className="chapter-tab-body">
          {activeTab === "content" && (
            <ContentBody
              chapterId={chapterId}
              contents={chapter.chapterContent}
              onUpdate={setChapter}
            />
          )}
          {activeTab === "video" && (
            <VideoContent
              chapterId={chapterId}
              videos={chapter.chapterVideo}
              onUpdate={setChapter}
            />
          )}
          {activeTab === "pdf" && (
            <PdfContent
              chapterId={chapterId}
              pdfs={chapter.chapterPdf}
              onUpdate={setChapter}
            />
          )}
          {activeTab === "practice" && (
            <PracticeQuestion
              chapterId={chapterId}
              practices={chapter.chapterPractice}
              onUpdate={setChapter}
            />
          )}
          {activeTab === "assignment" && (
            <AssignmentContent
              chapterId={chapterId}
              assignments={chapter.chapterAssignment}
              onUpdate={setChapter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
