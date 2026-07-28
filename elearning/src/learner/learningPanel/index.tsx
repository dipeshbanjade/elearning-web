import { useState } from "react";
import { mockDiscussion, mockVideoQuestions } from "../../data/mockDashboard";
import type { ChapterVideoItem } from "../types";
import VideoPlayer from "../videoPlayer";
import AskQuestionBox from "../askQuestionBox";
import DiscussionBoard from "../discussionBoard";

interface Props {
  videos: ChapterVideoItem[];
}

export default function LearningPanel({ videos }: Props) {
  const [selectedId, setSelectedId] = useState(videos[0]?._id ?? "");
  const selected = videos.find((v) => v._id === selectedId) ?? videos[0];

  if (videos.length === 0) {
    return <p className="side-panel-empty">No videos for this chapter yet.</p>;
  }

  const questions = mockVideoQuestions[selected._id] ?? [];
  const discussion = mockDiscussion[selected._id] ?? [];

  return (
    <div className="learning-panel">
      {videos.length > 1 && (
        <div className="video-list">
          {videos.map((v) => (
            <button
              key={v._id}
              className={`video-list-item ${v._id === selected._id ? "active" : ""}`}
              onClick={() => setSelectedId(v._id)}
            >
              {v.title ?? "Untitled video"}
            </button>
          ))}
        </div>
      )}

      <VideoPlayer video={selected} />
      <AskQuestionBox videoId={selected._id} questions={questions} />
      <DiscussionBoard videoId={selected._id} messages={discussion} />
    </div>
  );
}
