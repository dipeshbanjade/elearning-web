import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import LoginStep from "./auth/LoginStep";
import ForgetPassword from "./auth/forgetPassword";
import UserRoute from "./router/UserRoute";
import TeacherRoute from "./router/TeacherRoute";
import UserLayout from "./layouts/UserLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import Dashboard from "./learner";
import SelectCategories from "./learner/selectCategories";
import SuperAdminDashboard from "./admin/superadmin";
import CompanyProfile from "./admin/superadmin/companyProfile";
import Categories from "./admin/superadmin/categories";
import Subcategories from "./admin/superadmin/subcategories";
import Subsubcategories from "./admin/superadmin/subsubcategories";
import ManageTeacher from "./admin/superadmin/teacher";
import ClassSubjectAssignment from "./admin/superadmin/teacher/classAssignment";
import ManageLearner from "./admin/superadmin/learner";
import TeacherDashboard from "./admin/teacher";
import TeacherContent from "./admin/teacher/content";
import ChapterContent from "./admin/teacher/content/chapterContent";
import TeacherLearner from "./admin/teacher/teacherLearner";
import LearnerNotice from "./admin/teacher/notice";
import Assignment from "./admin/teacher/assignment";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-step" element={<LoginStep />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* User-protected  (role: user) */}
        <Route
          path="/select-categories"
          element={
            <UserRoute>
              <UserLayout>
                <SelectCategories /> // step 2 their preferred categories
              </UserLayout>
            </UserRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <UserLayout>
                <Dashboard />
              </UserLayout>
            </UserRoute>
          }
        />

        {/* Subject page — also user-protected */}
        <Route
          path="/subject/:id"
          element={
            <UserRoute>
              <UserLayout>
                <div style={{ padding: "2rem", color: "#64748B" }}>
                  Subject page — coming soon.
                </div>
              </UserLayout>
            </UserRoute>
          }
        />

        {/* Admin-protected  (role: sup) */}
        <Route path="/admin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="setting/company-profile" element={<CompanyProfile />} />
          <Route path="setting/categories" element={<Categories />} />
          <Route path="setting/subcategories" element={<Subcategories />} />
          <Route
            path="setting/subsubcategories"
            element={<Subsubcategories />}
          />
          <Route path="teacher/list" element={<ManageTeacher />} />
          <Route
            path="teacher/assignment"
            element={<ClassSubjectAssignment />}
          />
          <Route path="learner" element={<ManageLearner />} />
        </Route>

        {/* Teacher-protected  (role: teacher) */}
        <Route
          path="/teacher"
          element={
            <TeacherRoute>
              <TeacherLayout />
            </TeacherRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="learner" element={<TeacherLearner />} />
          <Route path="content/:id" element={<TeacherContent />} />
          <Route
            path="content/:id/chapter/:chapterId"
            element={<ChapterContent />}
          />
          <Route path="notice" element={<LearnerNotice />} />
          <Route path="assignment" element={<Assignment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
