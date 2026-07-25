import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import RightPanel from "../../../component/rightPanel";
import superAdminApi from "../../../api/superAdminApi";
import Loading from "../../../helper/Loading";
import type { UserRecord } from "../../../propsInterface/Interface";

interface Option {
  value: string;
  label: string;
}

interface SubSubCategoryOption {
  _id: string;
  name: string;
}

interface GradeWithSubjects {
  _id: string;
  name: string;
  subSubCategories: SubSubCategoryOption[];
}

interface AssignedSubject {
  subsubCatId: string;
  subsubcatName: string;
}

interface AssignedGrade {
  subCatId: string;
  subCatName: string;
  subjectMenu: AssignedSubject[];
}

interface AssignedCategory {
  categoryId: string;
  categoryName: string;
  submenu: AssignedGrade[];
}

interface TeacherAssignDoc {
  userId: string;
  assignMenu: AssignedCategory[];
}

export default function ClassSubjectAssignment() {
  const [loading, setLoading] = useState(false);
  const [teacherList, setTeacherList] = useState<UserRecord[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<UserRecord | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Option | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const [gradeOptions, setGradeOptions] = useState<GradeWithSubjects[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignDoc[]>([]);

  const fetchGradeSubject = async (catId: string) => {
    try {
      const res = await superAdminApi.fetchSubCatSubsubCat(catId);
      console.log("response", res);
      if (res?.success === true) {
        setGradeOptions(res?.data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeacherData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.fetchUsersByRole("teacher", {
        havePagination: false,
      });
      setTeacherList(res?.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await superAdminApi.fetchAllTeacherAssign();
      setAssignments(res?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) {
        await fetchTeacherData();
        await fetchAssignments();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchTeacherData, fetchAssignments]);

  const filteredTeachers = teacherList.filter((teacher) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      teacher.fullname.toLowerCase().includes(term) ||
      teacher.username.toLowerCase().includes(term)
    );
  });

  const openAssign = (teacher: UserRecord) => {
    setSelectedTeacher(teacher);
    setSelectedGrade(null);
    setSelectedSubjects([]);
    setGradeOptions([]);

    const catId = teacher.Category?.[0]?._id;
    if (catId) fetchGradeSubject(catId);
  };

  const summarizeAssignment = (userId: string) => {
    const doc = assignments.find((a) => a.userId === userId);
    if (!doc) return "-";

    const parts = doc.assignMenu.flatMap((category) =>
      category.submenu.map((grade) => {
        const subjects = grade.subjectMenu
          .map((subject) => subject.subsubcatName)
          .join(", ");
        return subjects ? `${grade.subCatName}: ${subjects}` : grade.subCatName;
      }),
    );

    return parts.length > 0 ? parts.join("; ") : "-";
  };

  const handleGradeChange = (opt: Option | null) => {
    setSelectedGrade(opt);
    setSelectedSubjects([]);
  };

  const gradeSelectOptions: Option[] = gradeOptions.map((grade) => ({
    value: grade._id,
    label: grade.name,
  }));

  const subjectSelectOptions: Option[] = selectedGrade
    ? (
        gradeOptions.find((grade) => grade._id === selectedGrade.value)
          ?.subSubCategories ?? []
      ).map((subject) => ({ value: subject._id, label: subject.name }))
    : [];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedTeacher || !selectedGrade || selectedSubjects.length === 0) {
      alert("Please pick a grade and at least one subject.");
      return;
    }

    const category = selectedTeacher.Category?.[0];
    if (!category) {
      alert("This teacher has no category to assign under.");
      return;
    }

    try {
      setSubmitting(true);
      await superAdminApi.assignTeacherGradeSubject({
        userId: selectedTeacher._id,
        categoryId: category._id,
        categoryName: category.name,
        subCatId: selectedGrade.value,
        subCatName: selectedGrade.label,
        subjects: selectedSubjects.map((subject) => ({
          subsubCatId: subject.value,
          subsubcatName: subject.label,
        })),
      });
      await fetchAssignments();
      setSelectedTeacher(null);
    } catch (error) {
      console.error(error);
      alert("Could not save the assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Class &amp; Subject Assignment</h1>

      <div style={{ maxWidth: 300 }} className="mb-3">
        <input
          type="text"
          placeholder="Search teachers..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Grade - Subject</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.fullname}</td>
                  <td>{teacher.username}</td>
                  <td>{teacher.Category?.[0]?.name ?? "-"}</td>
                  <td>{summarizeAssignment(teacher._id)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => openAssign(teacher)}
                    >
                      <i className="fa fa-eye"></i>
                      Assign
                    </button>

                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openAssign(teacher)}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted text-center">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <RightPanel
        isOpen={selectedTeacher !== null}
        onClose={() => setSelectedTeacher(null)}
        title={selectedTeacher ? `Assign — ${selectedTeacher.fullname}` : ""}
      >
        <div className="mb-2">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={selectedTeacher?.username ?? ""}
            disabled
          />
        </div>

        <div className="mb-2">
          <label htmlFor="grade">Grade</label>
          <Select<Option, false>
            inputId="grade"
            options={gradeSelectOptions}
            value={selectedGrade}
            onChange={handleGradeChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="subject">Select Subject</label>
          <Select<Option, true>
            inputId="subject"
            isMulti
            options={subjectSelectOptions}
            value={selectedSubjects}
            onChange={(opts) => setSelectedSubjects([...opts])}
          />
        </div>

        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Assign Class & Subject"}
        </button>
      </RightPanel>
    </div>
  );
}
