import type { Topic } from "../../data/mockDashboard";

interface Props {
  topic: Topic;
}

export default function VideoPlayer({ topic }: Props) {
  return (
    <div className="video-player">
      <video key={topic.id} className="video-player-el" src={topic.videoUrl} controls />
      <div className="video-meta">
        <h2 className="video-title">{topic.title}</h2>
        <span className="video-duration">{topic.duration}</span>
      </div>
      <p className="video-description">{topic.description}</p>
    </div>
  );
}
