import type { Topic } from "../../data/mockDashboard";
import { mockDiscussion, mockVideoQuestions } from "../../data/mockDashboard";
import VideoPlayer from "./VideoPlayer";
import AskQuestionBox from "./AskQuestionBox";
import DiscussionBoard from "./DiscussionBoard";

interface Props {
  topic: Topic;
}

export default function LearningPanel({ topic }: Props) {
  const questions = mockVideoQuestions[topic.id] ?? [];
  const discussion = mockDiscussion[topic.id] ?? [];

  return (
    <div className="learning-panel">
      <VideoPlayer topic={topic} />
      <AskQuestionBox topicId={topic.id} questions={questions} />
      <DiscussionBoard topicId={topic.id} messages={discussion} />
    </div>
  );
}
