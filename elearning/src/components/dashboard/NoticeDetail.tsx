import type { Notice } from "../../data/mockDashboard";

interface Props {
  notice: Notice;
}

export default function NoticeDetail({ notice }: Props) {
  return (
    <div className="detail-view">
      <div className="detail-view-top">
        <h2 className="detail-view-title">{notice.title}</h2>
      </div>

      <div className="detail-view-meta">
        <span>{notice.teacher}</span>
        <span>{new Date(notice.postedAt).toLocaleDateString()}</span>
      </div>

      <p className="detail-view-body">{notice.message}</p>
    </div>
  );
}
