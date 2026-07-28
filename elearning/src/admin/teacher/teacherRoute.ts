import axios from "axios";
import { getStoredUser } from "../../helper/helper";

export interface Chapter {
  _id: string;
  subSubCategoryId: string;
  chapterTitle: string;
  chapterDesc?: string;
  chapterThumbnail?: string;
  orderColumn?: number;
}

interface ChapterPayload {
  subSubCategoryId: string;
  chapterTitle: string;
  chapterDesc?: string;
  chapterThumbnail?: string;
  orderColumn?: number;
}

export interface ChapterVideo {
  _id: string;
  title?: string;
  videoLink?: { public_id?: string; url?: string };
  order?: number;
}

export interface ChapterPdf {
  _id: string;
  title?: string;
  file?: { public_id?: string; url?: string };
}

export interface ChapterAssignment {
  _id: string;
  title?: string;
  hint?: string;
  deadline?: string;
}

export interface ChapterPractice {
  _id: string;
  question: string;
  option: string[];
  answer: string;
}

export interface ChapterContentItem {
  _id: string;
  title: string;
  content?: string;
}

export interface ChapterDetail extends Chapter {
  chapterContent: ChapterContentItem[];
  chapterVideo: ChapterVideo[];
  chapterPdf: ChapterPdf[];
  chapterAssignment: ChapterAssignment[];
  chapterPractice: ChapterPractice[];
}

class teacherRoute {
  baseUrl: string = import.meta.env.VITE_BASEAPI || "http://localhost:8093/api";

  private authHeaders() {
    const token = getStoredUser()?.token;
    return { Authorization: `Bearer ${token}` };
  }

  async fetchChapters(subSubCategoryId: string) {
    const url = `${this.baseUrl}/teacher/chapter-list`;
    const res = await axios({
      url,
      method: "post",
      data: { subSubCategoryId },
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async createChapter(data: ChapterPayload) {
    const url = `${this.baseUrl}/teacher/create-chapter-name`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapter(id: string, data: ChapterPayload) {
    const url = `${this.baseUrl}/teacher/update-chapter/${id}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async fetchChapterById(chapterId: string) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}`;
    const res = await axios({
      url,
      method: "get",
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async addChapterContent(
    chapterId: string,
    data: { title: string; content: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/content`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapterContent(
    chapterId: string,
    itemId: string,
    data: { title: string; content: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/content/${itemId}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async addChapterVideo(
    chapterId: string,
    data: { title: string; url: string; order?: number },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/video`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapterVideo(
    chapterId: string,
    itemId: string,
    data: { title: string; url: string; order?: number },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/video/${itemId}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async addChapterPdf(chapterId: string, data: { title: string; url: string }) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/pdf`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapterPdf(
    chapterId: string,
    itemId: string,
    data: { title: string; url: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/pdf/${itemId}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async addChapterAssignment(
    chapterId: string,
    data: { title: string; hint?: string; deadline?: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/assignment`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapterAssignment(
    chapterId: string,
    itemId: string,
    data: { title: string; hint?: string; deadline?: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/assignment/${itemId}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async addChapterPractice(
    chapterId: string,
    data: { question: string; option: string[]; answer: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/practice`;
    const res = await axios({
      url,
      method: "post",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }

  async updateChapterPractice(
    chapterId: string,
    itemId: string,
    data: { question: string; option: string[]; answer: string },
  ) {
    const url = `${this.baseUrl}/teacher/chapter/${chapterId}/practice/${itemId}`;
    const res = await axios({
      url,
      method: "patch",
      data,
      headers: this.authHeaders(),
    });
    return res?.data;
  }
}

export default new teacherRoute();
