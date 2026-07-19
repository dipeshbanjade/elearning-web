import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useParams } from "react-router-dom";
import { checkValidation } from "../../superadmin/validation";
import superAdminRoute from "../../superadmin/superAdminRoute";
import Loading from "../../../helper/Loading";
import {
  seedDemoTags,
  newId,
  type Tag,
} from "../../../data/mockTeacherContent";

interface SubSubCategory {
  _id: string;
  name: string;
  subCategoryId: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

const emptyTopicForm = {
  learning: "",
  practiceQuestion: "",
  practiceAnswer: "",
  assignmentTitle: "",
  assignmentDescription: "",
  assignmentDueDate: "",
  noteBookLink: "",
};

export default function TeacherContent() {
  const { id: subSubCategoryId } = useParams<{ id: string }>();
  if (!subSubCategoryId) return null;

  // Remount the body whenever the subsubcategory changes so all its local
  // state (tags, selected folder, open forms) resets on its own instead of
  // needing an effect to do it.
  return <TeacherContentBody key={subSubCategoryId} subSubCategoryId={subSubCategoryId} />;
}

function TeacherContentBody({ subSubCategoryId }: { subSubCategoryId: string }) {
  const [subSubCategory, setSubSubCategory] = useState<SubSubCategory | null>(
    null,
  );
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [tags, setTags] = useState<Tag[]>(() => seedDemoTags(subSubCategoryId));
  const [selectedTagId, setSelectedTagId] = useState("");

  const [showTagForm, setShowTagForm] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagUnit, setTagUnit] = useState("");
  const [tagErrorMsg, setTagErrorMsg] = useState("");

  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState(emptyTopicForm);
  const [learningErrorMsg, setLearningErrorMsg] = useState("");

  const loadCategoryInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminRoute.getCategoryTree();
      const ssc = (res?.subSubCategories ?? []).find(
        (c: SubSubCategory) => c._id === subSubCategoryId,
      );
      setSubSubCategory(ssc ?? null);
      if (ssc) {
        const sc = (res?.subCategories ?? []).find(
          (c: SubCategory) => c._id === ssc.subCategoryId,
        );
        setSubCategory(sc ?? null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [subSubCategoryId]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await loadCategoryInfo();
    })();
    return () => {
      ignore = true;
    };
  }, [loadCategoryInfo]);

  const selectedTag = tags.find((t) => t.id === selectedTagId) ?? null;

  const resetTagForm = () => {
    setTagName("");
    setTagUnit("");
    setTagErrorMsg("");
    setShowTagForm(false);
  };

  const handleTagNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagName(e.target.value);
    setTagErrorMsg(checkValidation("name", e.target.value));
  };

  const handleTagSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = checkValidation("name", tagName);
    if (error) {
      setTagErrorMsg(error);
      return;
    }

    const tag: Tag = {
      id: newId("tag"),
      name: tagName,
      unit: tagUnit,
      topics: [],
    };
    setTags((prev) => [...prev, tag]);
    setSelectedTagId(tag.id);
    resetTagForm();
  };

  const handleDeleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    if (selectedTagId === id) setSelectedTagId("");
  };

  const resetTopicForm = () => {
    setTopicForm(emptyTopicForm);
    setLearningErrorMsg("");
    setShowTopicForm(false);
  };

  const handleTopicFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTopicForm((prev) => ({ ...prev, [name]: value }));
    if (name === "learning") setLearningErrorMsg(checkValidation("name", value));
  };

  const handleTopicSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTag) return;

    const error = checkValidation("name", topicForm.learning);
    if (error) {
      setLearningErrorMsg(error);
      return;
    }

    setTags((prev) =>
      prev.map((tag) => {
        if (tag.id !== selectedTag.id) return tag;
        return {
          ...tag,
          topics: [
            ...tag.topics,
            {
              id: newId("topic"),
              learning: topicForm.learning,
              practice: topicForm.practiceQuestion
                ? [
                    {
                      id: newId("pq"),
                      question: topicForm.practiceQuestion,
                      answer: topicForm.practiceAnswer,
                    },
                  ]
                : [],
              assignment: topicForm.assignmentTitle
                ? [
                    {
                      id: newId("as"),
                      title: topicForm.assignmentTitle,
                      description: topicForm.assignmentDescription,
                      dueDate: topicForm.assignmentDueDate,
                    },
                  ]
                : [],
              noteBookLink: topicForm.noteBookLink,
            },
          ],
        };
      }),
    );
    resetTopicForm();
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!selectedTag) return;
    setTags((prev) =>
      prev.map((tag) =>
        tag.id !== selectedTag.id
          ? tag
          : { ...tag, topics: tag.topics.filter((t) => t.id !== topicId) },
      ),
    );
  };

  if (loading) return <Loading />;

  if (!subSubCategory) {
    return (
      <div>
        <h1 className="page-title">Content</h1>
        <p className="text-muted">
          This subsubcategory could not be found. Pick one from the
          Subcategories menu on the left.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted mb-1">
        {subCategory?.name ?? "Subcategory"} / {subSubCategory.name}
      </p>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title mb-0">{subSubCategory.name}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (showTagForm ? resetTagForm() : setShowTagForm(true))}
        >
          {showTagForm ? "Close" : "+ Add Tag"}
        </button>
      </div>

      {showTagForm && (
        <div className="alert alert-info">
          <form onSubmit={handleTagSubmit}>
            <div className="row g-2 align-items-start">
              <div className="col-md-3">
                <label className="form-label">Tag Name</label>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  value={tagName}
                  onChange={handleTagNameChange}
                  className="form-control"
                />
                {tagErrorMsg && (
                  <div className="text-danger mt-1">{tagErrorMsg}</div>
                )}
              </div>
            </div>
            <div className="row g-2 align-items-start mt-2">
              <div className="col-md-3">
                <label className="form-label">Unit (optional)</label>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  value={tagUnit}
                  onChange={(e) => setTagUnit(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-success w-100">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="tag-folder-grid">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`tag-folder-card ${selectedTagId === tag.id ? "active" : ""}`}
            onClick={() => setSelectedTagId(tag.id)}
          >
            <span className="tag-folder-icon">📁</span>
            <span>{tag.name}</span>
            {tag.unit && <span className="tag-folder-unit">{tag.unit}</span>}
            <span className="tag-folder-count">{tag.topics.length} topic(s)</span>
          </div>
        ))}

        {tags.length === 0 && (
          <p className="text-muted">No tags yet — add one to get started.</p>
        )}
      </div>

      {selectedTag && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 mb-0">{selectedTag.name} — Topics</h2>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm me-2"
                onClick={() =>
                  showTopicForm ? resetTopicForm() : setShowTopicForm(true)
                }
              >
                {showTopicForm ? "Close" : "+ Add Topic"}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDeleteTag(selectedTag.id)}
              >
                Delete Tag
              </button>
            </div>
          </div>

          {showTopicForm && (
            <div className="alert alert-info">
              <form onSubmit={handleTopicSubmit}>
                <div className="mb-3">
                  <label className="form-label">Learning content</label>
                  <textarea
                    name="learning"
                    value={topicForm.learning}
                    onChange={handleTopicFieldChange}
                    className="form-control"
                    rows={3}
                  />
                  {learningErrorMsg && (
                    <div className="text-danger mt-1">{learningErrorMsg}</div>
                  )}
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Practice question</label>
                    <input
                      type="text"
                      name="practiceQuestion"
                      value={topicForm.practiceQuestion}
                      onChange={handleTopicFieldChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Practice answer</label>
                    <input
                      type="text"
                      name="practiceAnswer"
                      value={topicForm.practiceAnswer}
                      onChange={handleTopicFieldChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row g-2 mt-1">
                  <div className="col-md-4">
                    <label className="form-label">Assignment title</label>
                    <input
                      type="text"
                      name="assignmentTitle"
                      value={topicForm.assignmentTitle}
                      onChange={handleTopicFieldChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label">Assignment description</label>
                    <input
                      type="text"
                      name="assignmentDescription"
                      value={topicForm.assignmentDescription}
                      onChange={handleTopicFieldChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Due date</label>
                    <input
                      type="date"
                      name="assignmentDueDate"
                      value={topicForm.assignmentDueDate}
                      onChange={handleTopicFieldChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3 mt-2">
                  <label className="form-label">Notebook link (optional)</label>
                  <input
                    type="text"
                    name="noteBookLink"
                    value={topicForm.noteBookLink}
                    onChange={handleTopicFieldChange}
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Save Topic
                </button>
              </form>
            </div>
          )}

          <ul className="list-view-items">
            {selectedTag.topics.map((topic) => (
              <li key={topic.id} className="list-view-item">
                <div className="d-flex align-items-start justify-content-between">
                  <p className="mb-0">{topic.learning}</p>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => handleDeleteTopic(topic.id)}
                  >
                    Delete
                  </button>
                </div>

                {topic.practice.length > 0 && (
                  <p className="list-view-item-desc mb-0">
                    Practice: {topic.practice[0].question}
                  </p>
                )}
                {topic.assignment.length > 0 && (
                  <p className="list-view-item-desc mb-0">
                    Assignment: {topic.assignment[0].title}
                    {topic.assignment[0].dueDate &&
                      ` (due ${topic.assignment[0].dueDate})`}
                  </p>
                )}
                {topic.noteBookLink && (
                  <p className="list-view-item-desc mb-0">
                    Notebook: {topic.noteBookLink}
                  </p>
                )}
              </li>
            ))}

            {selectedTag.topics.length === 0 && (
              <p className="text-muted">No topics in this tag yet.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
