// Fake data standing in for the backend until the real endpoints exist.
// Swap fetchDashboardSubjects()/etc for real API calls once the server side is ready.

export type Topic = {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  description: string;
};

export type Chapter = {
  id: string;
  title: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
};

export type VideoQuestion = {
  id: string;
  askedBy: string;
  question: string;
  answer?: string;
  askedAt: string;
};

export type DiscussionMessage = {
  id: string;
  author: string;
  role: "student" | "teacher";
  message: string;
  postedAt: string;
};

export type PracticeQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AssignmentStatus = "pending" | "in-progress" | "done";

export type Assignment = {
  id: string;
  subjectId: string;
  title: string;
  chapterName: string;
  teacher: string;
  dueDate: string;
  status: AssignmentStatus;
  description: string;
};

export const ASSIGNMENT_STATUS_LABEL: Record<AssignmentStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  done: "Done",
};

export type Notice = {
  id: string;
  subjectId: string;
  title: string;
  message: string;
  teacher: string;
  postedAt: string;
};

export type NotebookResource = {
  id: string;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
};

export type ProgressStat = {
  id: string;
  label: string;
  value: number;
  detail: string;
};

// A handful of royalty-free sample clips so every video tile isn't identical.
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

export const mockSubjects: Subject[] = [
  {
    id: "sub-math",
    name: "Mathematics",
    icon: "📐",
    chapters: [
      {
        id: "math-ch1",
        title: "Algebra Basics",
        topics: [
          {
            id: "math-ch1-t1",
            title: "Introduction to Variables",
            videoUrl: SAMPLE_VIDEOS[0],
            duration: "8:24",
            description:
              "What a variable is, why we use letters instead of numbers, and how to read simple expressions.",
          },
          {
            id: "math-ch1-t2",
            title: "Solving Linear Equations",
            videoUrl: SAMPLE_VIDEOS[1],
            duration: "11:02",
            description:
              "Step by step method for isolating x in a one-variable linear equation.",
          },
        ],
      },
      {
        id: "math-ch2",
        title: "Geometry Foundations",
        topics: [
          {
            id: "math-ch2-t1",
            title: "Angles and Triangles",
            videoUrl: SAMPLE_VIDEOS[2],
            duration: "9:47",
            description:
              "Types of angles, the angle sum property of a triangle, and a few worked examples.",
          },
          {
            id: "math-ch2-t2",
            title: "Perimeter and Area",
            videoUrl: SAMPLE_VIDEOS[0],
            duration: "7:15",
            description:
              "Formulas for common shapes and how to pick the right one for a word problem.",
          },
        ],
      },
      {
        id: "math-ch3",
        title: "Introduction to Statistics",
        topics: [
          {
            id: "math-ch3-t1",
            title: "Mean, Median and Mode",
            videoUrl: SAMPLE_VIDEOS[1],
            duration: "10:10",
            description:
              "The three most common measures of central tendency and when to use each.",
          },
        ],
      },
    ],
  },
  {
    id: "sub-science",
    name: "Science",
    icon: "🔬",
    chapters: [
      {
        id: "sci-ch1",
        title: "The Cell",
        topics: [
          {
            id: "sci-ch1-t1",
            title: "Cell Structure",
            videoUrl: SAMPLE_VIDEOS[2],
            duration: "12:30",
            description:
              "A tour of the parts of a cell and what each one does, in plants and animals.",
          },
          {
            id: "sci-ch1-t2",
            title: "Cell Division",
            videoUrl: SAMPLE_VIDEOS[0],
            duration: "9:05",
            description: "How mitosis copies a cell's genetic material and splits it in two.",
          },
        ],
      },
      {
        id: "sci-ch2",
        title: "Forces and Motion",
        topics: [
          {
            id: "sci-ch2-t1",
            title: "Newton's Laws",
            videoUrl: SAMPLE_VIDEOS[1],
            duration: "13:52",
            description: "The three laws of motion explained with everyday examples.",
          },
        ],
      },
    ],
  },
  {
    id: "sub-english",
    name: "English",
    icon: "📖",
    chapters: [
      {
        id: "eng-ch1",
        title: "Grammar Essentials",
        topics: [
          {
            id: "eng-ch1-t1",
            title: "Parts of Speech",
            videoUrl: SAMPLE_VIDEOS[2],
            duration: "6:40",
            description: "Nouns, verbs, adjectives and the rest, with quick examples of each.",
          },
          {
            id: "eng-ch1-t2",
            title: "Tenses Overview",
            videoUrl: SAMPLE_VIDEOS[0],
            duration: "14:18",
            description: "Past, present and future tense, and the forms within each.",
          },
        ],
      },
      {
        id: "eng-ch2",
        title: "Essay Writing",
        topics: [
          {
            id: "eng-ch2-t1",
            title: "Structuring an Essay",
            videoUrl: SAMPLE_VIDEOS[1],
            duration: "10:55",
            description: "Introduction, body paragraphs and conclusion — what each one needs.",
          },
        ],
      },
    ],
  },
];

export const mockVideoQuestions: Record<string, VideoQuestion[]> = {
  "math-ch1-t1": [
    {
      id: "vq1",
      askedBy: "Sujata Rai",
      question: "Why do we always use x and y? Can we use any letter?",
      answer: "Any letter works — x and y are just the most common convention.",
      askedAt: "2026-07-08T10:12:00Z",
    },
  ],
  "math-ch1-t2": [
    {
      id: "vq2",
      askedBy: "Bikash Thapa",
      question: "At 4:30 you moved the 3 to the other side — why did the sign flip?",
      answer: "Because we subtracted 3 from both sides, not just moved it across.",
      askedAt: "2026-07-08T11:02:00Z",
    },
  ],
  "sci-ch1-t1": [
    {
      id: "vq3",
      askedBy: "Anita Gurung",
      question: "Is the mitochondria the same in plant and animal cells?",
      askedAt: "2026-07-09T09:40:00Z",
    },
  ],
};

export const mockDiscussion: Record<string, DiscussionMessage[]> = {
  "math-ch1-t1": [
    {
      id: "d1",
      author: "Bikash Thapa",
      role: "student",
      message: "This finally made variables click for me, thanks!",
      postedAt: "2026-07-08T12:00:00Z",
    },
    {
      id: "d2",
      author: "Mr. Karki",
      role: "teacher",
      message: "Glad to hear it. Try the practice tab for a few quick checks.",
      postedAt: "2026-07-08T12:20:00Z",
    },
  ],
  "math-ch1-t2": [
    {
      id: "d3",
      author: "Sujata Rai",
      role: "student",
      message: "Can we get a video on equations with variables on both sides too?",
      postedAt: "2026-07-08T13:05:00Z",
    },
  ],
  "sci-ch1-t1": [
    {
      id: "d4",
      author: "Anita Gurung",
      role: "student",
      message: "The diagram around 6:00 was really helpful for the labeling homework.",
      postedAt: "2026-07-09T10:00:00Z",
    },
  ],
};

// Notebook = reference material the teacher has uploaded for a topic (a PDF),
// not personal notes — not every topic has one yet.
const SAMPLE_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const mockNotebooks: Record<string, NotebookResource> = {
  "math-ch1-t1": {
    id: "nb1",
    title: "Introduction to Variables — Notes",
    fileUrl: SAMPLE_PDF,
    uploadedBy: "Mr. Karki",
    uploadedAt: "2026-07-05T09:00:00Z",
  },
  "math-ch1-t2": {
    id: "nb2",
    title: "Solving Linear Equations — Worked Examples",
    fileUrl: SAMPLE_PDF,
    uploadedBy: "Mr. Karki",
    uploadedAt: "2026-07-06T09:00:00Z",
  },
  "sci-ch1-t1": {
    id: "nb3",
    title: "Cell Structure — Labelled Diagram Sheet",
    fileUrl: SAMPLE_PDF,
    uploadedBy: "Mrs. Shrestha",
    uploadedAt: "2026-07-07T09:00:00Z",
  },
};

export const mockPractice: Record<string, PracticeQuestion[]> = {
  "math-ch1-t1": [
    {
      id: "pq1",
      question: "In the expression 3x + 5, what is the variable?",
      options: ["3", "x", "5", "+"],
      correctIndex: 1,
      explanation: "x is the symbol standing in for an unknown number.",
    },
    {
      id: "pq2",
      question: "If x = 4, what does 2x equal?",
      options: ["6", "2", "8", "42"],
      correctIndex: 2,
      explanation: "2x means 2 multiplied by x, so 2 × 4 = 8.",
    },
  ],
  "math-ch1-t2": [
    {
      id: "pq3",
      question: "Solve for x: x + 7 = 12",
      options: ["x = 19", "x = 5", "x = 7", "x = 12"],
      correctIndex: 1,
      explanation: "Subtract 7 from both sides: x = 12 - 7 = 5.",
    },
  ],
  "sci-ch1-t1": [
    {
      id: "pq4",
      question: "Which part of the cell controls what enters and leaves it?",
      options: ["Nucleus", "Cell membrane", "Mitochondria", "Cytoplasm"],
      correctIndex: 1,
      explanation: "The cell membrane regulates the movement of substances in and out.",
    },
  ],
};

export const mockAssignments: Assignment[] = [
  {
    id: "as1",
    subjectId: "sub-math",
    title: "Worksheet: Solving Linear Equations",
    chapterName: "Algebra Basics",
    teacher: "Mr. Karki",
    dueDate: "2026-07-15",
    status: "pending",
    description: "Solve questions 1 to 12 on page 34 and upload a photo of your working.",
  },
  {
    id: "as2",
    subjectId: "sub-math",
    title: "Quiz: Angles and Triangles",
    chapterName: "Geometry Foundations",
    teacher: "Mr. Karki",
    dueDate: "2026-07-18",
    status: "in-progress",
    description: "10-question quiz covering angle types and the triangle angle sum rule.",
  },
  {
    id: "as3",
    subjectId: "sub-science",
    title: "Lab Report: Cell Observation",
    chapterName: "The Cell",
    teacher: "Mrs. Shrestha",
    dueDate: "2026-07-12",
    status: "done",
    description: "Write up your observations from the onion cell slide under the microscope.",
  },
  {
    id: "as4",
    subjectId: "sub-english",
    title: "Essay: My Favourite Season",
    chapterName: "Essay Writing",
    teacher: "Ms. Adhikari",
    dueDate: "2026-07-20",
    status: "pending",
    description: "300-word essay using the structure covered in class — intro, body, conclusion.",
  },
];

export const mockProgress: Record<string, ProgressStat[]> = {
  "sub-math": [
    { id: "p1", label: "Videos Watched", value: 62, detail: "5 of 8 topic videos watched so far." },
    { id: "p2", label: "Practice Score", value: 78, detail: "78% average across the practice quizzes you've taken." },
    { id: "p3", label: "Assignments Completed", value: 40, detail: "2 of 5 assignments submitted." },
    { id: "p4", label: "Overall Progress", value: 58, detail: "58% of the Mathematics course completed." },
  ],
  "sub-science": [
    { id: "p5", label: "Videos Watched", value: 45, detail: "3 of 6 topic videos watched so far." },
    { id: "p6", label: "Practice Score", value: 66, detail: "66% average across the practice quizzes you've taken." },
    { id: "p7", label: "Assignments Completed", value: 50, detail: "1 of 2 assignments submitted." },
    { id: "p8", label: "Overall Progress", value: 49, detail: "49% of the Science course completed." },
  ],
  "sub-english": [
    { id: "p9", label: "Videos Watched", value: 33, detail: "1 of 3 topic videos watched so far." },
    { id: "p10", label: "Practice Score", value: 0, detail: "No practice quizzes attempted yet." },
    { id: "p11", label: "Assignments Completed", value: 0, detail: "0 of 1 assignment submitted." },
    { id: "p12", label: "Overall Progress", value: 22, detail: "22% of the English course completed." },
  ],
};

export const mockNotices: Notice[] = [
  {
    id: "no1",
    subjectId: "sub-math",
    title: "Extra class this Saturday",
    message: "There will be an extra algebra revision class this Saturday at 10 AM.",
    teacher: "Mr. Karki",
    postedAt: "2026-07-09T08:00:00Z",
  },
  {
    id: "no2",
    subjectId: "sub-science",
    title: "Bring your lab coat",
    message: "Practical class next week needs a lab coat — please arrange one in advance.",
    teacher: "Mrs. Shrestha",
    postedAt: "2026-07-08T07:30:00Z",
  },
  {
    id: "no3",
    subjectId: "sub-english",
    title: "Essay deadline moved",
    message: "The essay deadline has been pushed to July 20th to allow for more feedback time.",
    teacher: "Ms. Adhikari",
    postedAt: "2026-07-07T14:00:00Z",
  },
];
