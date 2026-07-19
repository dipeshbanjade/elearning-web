// Demo/placeholder data for the teacher content workspace.
// There's no Tag/Chapter API on the frontend yet (only the mongoose schema
// on the backend), so this seeds a Tag + Topic per subsubcategory so the
// teacher can see the folder flow working before the real endpoints exist.

export interface PracticeItem {
  id: string;
  question: string;
  answer: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Topic {
  id: string;
  learning: string;
  practice: PracticeItem[];
  assignment: AssignmentItem[];
  noteBookLink: string;
}

export interface Tag {
  id: string;
  name: string;
  unit: string;
  topics: Topic[];
}

let nextId = 1;
export const newId = (prefix: string) => `${prefix}-${nextId++}`;

export const seedDemoTags = (subSubCategoryId: string): Tag[] => [
  {
    id: `tag-${subSubCategoryId}-1`,
    name: "Unit 1",
    unit: "Getting Started",
    topics: [
      {
        id: `topic-${subSubCategoryId}-1`,
        learning:
          "This is a sample topic — replace it with your own lesson content once you're ready.",
        practice: [
          {
            id: `pq-${subSubCategoryId}-1`,
            question: "Sample question — what is 2 + 2?",
            answer: "4",
          },
        ],
        assignment: [
          {
            id: `as-${subSubCategoryId}-1`,
            title: "Sample assignment",
            description: "Read the topic and answer the practice question.",
            dueDate: "",
          },
        ],
        noteBookLink: "",
      },
    ],
  },
];
