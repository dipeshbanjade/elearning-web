import type { ChapterVideoItem } from "../types";

interface Props {
  video: ChapterVideoItem;
}

// Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID and
// youtube.com/shorts/ID, pulling out just the 11-character video id.
function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function VideoPlayer({ video }: Props) {
  const url = video.videoLink?.url ?? "";
  const embedUrl = getYoutubeEmbedUrl(url);

  return (
    <div className="video-player">
      {embedUrl ? (
        <div className="video-player-frame">
          <iframe
            key={video._id}
            className="video-player-iframe"
            src={embedUrl}
            title={video.title ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video key={video._id} className="video-player-el" src={url} controls />
      )}
      <div className="video-meta">
        <h2 className="video-title">{video.title ?? "Untitled video"}</h2>
      </div>
    </div>
  );
}
