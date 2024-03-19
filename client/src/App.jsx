import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { ROLES } from "./constants";

// Components
import Layouts from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/dashboard/DashLayout";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import About from "./pages/About";

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


export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layouts />}>
          {/* Public Routes */}
          <Route index element={<Public />} />
          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
          <Route path="about" element={<About />} />
          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  <Route
                    element={<RequireAuth allowedRoles={[ROLES.Student]} />}
                  >
                    <Route path="master" element={<MasterList />} />
                  </Route>
                  <Route path="corsi" element={<Welcome />} />
                  <Route path="classifica" element={<LeaderboardList />} />
                  <Route path="account" element={<AccountDetails />} />
                  <Route path="profile" element={<ProfileDetails />} />
                  <Route path="profile/edit" element={<ProfilleUpdate />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
