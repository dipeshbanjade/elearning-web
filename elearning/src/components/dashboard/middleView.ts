// What the middle column of the dashboard is currently showing.
// Left (chapters) and right (progress/assignments/notices) stay put —
// clicking things in either column just swaps this out.
export type MiddleView =
  | { kind: "topic"; topicId: string }
  | { kind: "progress" }
  | { kind: "assignment"; assignmentId: string }
  | { kind: "assignments-all" }
  | { kind: "notice"; noticeId: string }
  | { kind: "notices-all" };
