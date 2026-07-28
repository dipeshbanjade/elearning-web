export interface SubjectListItem {
  _id: string;
  name: string;
  description?: string;
}

export interface ChapterContentItem {
  _id: string;
  title: string;
  content?: string;
}

export interface ChapterVideoItem {
  _id: string;
  title?: string;
  videoLink?: { public_id?: string; url?: string };
  order?: number;
}

export interface ChapterPdfItem {
  _id: string;
  title?: string;
  file?: { public_id?: string; url?: string };
}

export interface ChapterAssignmentItem {
  _id: string;
  title?: string;
  hint?: string;
  deadline?: string;
}

export interface ChapterPracticeItem {
  _id: string;
  question: string;
  option: string[];
  answer: string;
}

// A chapter's assignment, carried alongside the title of the chapter it
// came from — used for the sidebar/right-panel assignment views, which show
// assignments across every chapter in a subject at once.
export interface SidebarAssignment extends ChapterAssignmentItem {
  chapterTitle: string;
}

export interface Chapter {
  _id: string;
  subSubCategoryId: string;
  chapterTitle: string;
  chapterDesc?: string;
  chapterThumbnail?: string;
  orderColumn?: number;
  chapterContent: ChapterContentItem[];
  chapterVideo: ChapterVideoItem[];
  chapterPdf: ChapterPdfItem[];
  chapterAssignment: ChapterAssignmentItem[];
  chapterPractice: ChapterPracticeItem[];
}
