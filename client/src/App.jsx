import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { ROLES } from "./constants";

// Components
import DashLayout from "./components/dashboard/DashLayout";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";

// Features
import Welcome from "./features/auth/components/Welcome";
import SignIn from "./features/auth/components/SignIn";
import SignUp from "./features/auth/components/SignUp";
import MasterList from "./features/master/components/MasterList";
import Prefetch from "./features/auth/components/Prefetch";
import PersistLogin from "./features/auth/components/PersistLogin";
import RequireAuth from "./features/auth/components/RequireAuth";
import ProfileDetails from "./features/profile/components/ProfileDetails";
import LeaderboardList from "./features/leaderboard/components/LeaderboardList";
import AccountDetails from "./features/account/components/AccountDetails";
import ProfilleUpdate from "./features/profile/components/ProfilleUpdate";
import CourseList from "./features/course/components/CourseList";
import CourseDetail from "./features/course/components/CourseDetail";
import LessonsList from "./features/lessons/components/LessonsList";
import CreateLesson from "./features/lessons/components/CreateLesson";
import CreateCourse from "./features/course/components/CreateCourse";
import AccountStatusChecker from "./features/auth/components/AccountStatusChecker";
import ResetPasswordForm from "./features/auth/components/ResetPasswordForm";
import AuthLayout from "./features/auth/components/AuthLayout";
import CreateMaster from "./features/master/components/CreateMaster";
import MasterDetail from "./features/master/components/MasterDetail";
import LessonDetail from "./features/lessons/components/LessonDetail";
import UsersList from "./features/users/components/UsersList";
import ProjectList from "./features/project/components/ProjectList";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/dash" replace />} />
        {/* Public Routes */}
        <Route
          path="login"
          element={
            <AuthLayout title={"Accedi a Courseopia"}>
              <SignIn
                forgotPasswordText="Hai dimenticato la password?"
                signUpText="Non hai un account? REGISTRATI ORA"
              />
            </AuthLayout>
          }
        />
        <Route
          path="register"
          element={
            <AuthLayout title={"Registrati a Courseopia"}>
              <SignUp signInText={"Hai un account? ACCEDI"} />
            </AuthLayout>
          }
        />
        <Route
          path="password-dimenticata"
          element={
            <AuthLayout>
              <ResetPasswordForm signInText={"Hai un account? ACCEDI"} />
            </AuthLayout>
          }
        />
        <Route
          path="password-reset/:token"
          element={
            <AuthLayout>
              <ResetPasswordForm
                type="reset-password"
                signInText={"Hai un account? ACCEDI"}
              />
            </AuthLayout>
          }
        />
        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<AccountStatusChecker />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  {/* Master Routes */}
                  <Route path="master" element={<MasterList />} />
                  <Route path="master/:slug" element={<MasterDetail />} />
                  {/* Course Routes */}
                  <Route path="corsi" element={<CourseList />} />
                  <Route path="corso/:slug" element={<CourseDetail />} />
                  {/* Lesson Routes */}
                  <Route path="lezione/:slug" element={<LessonDetail />} />
                  {/* Leaderboard Routes */}
                  <Route path="classifica" element={<LeaderboardList />} />
                  {/* Account Routes */}
                  <Route path="account" element={<AccountDetails />} />
                  {/* Profile Routes */}
                  <Route path="profilo/:slug" element={<ProfileDetails />} />
                  <Route
                    path="modifica-profilo/:slug"
                    element={<ProfilleUpdate />}
                  />
                  {/* Protected Routes */}
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="crea-master" element={<CreateMaster />} />
                    <Route path="crea-corso" element={<CreateCourse />} />
                    <Route path="crea-lezione" element={<CreateLesson />} />
                    <Route path="utenti" element={<UsersList />} />
                  </Route>
                  {/* Protected Routes */}
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Admin, ROLES.Teacher]}
                      />
                    }
                  >
                    <Route path="lezioni" element={<LessonsList />} />
                    <Route path="progetti" element={<ProjectList />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
