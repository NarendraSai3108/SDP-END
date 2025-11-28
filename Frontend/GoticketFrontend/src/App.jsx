import { Route, Routes, Outlet } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Spinner from "./components/common/Spinner";

// Pages
import LandingPage from "./pages/LandingPage";
import LogoutPage from "./pages/LogoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminNavBar from "./pages/AdminNavBar";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminManagersPage from "./pages/AdminManagersPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfilePage from "./pages/ManagerProfilePage";
import ManagerCreateEvent from "./pages/ManagerCreateEvent"; 
import ManagerEditEvent from "./pages/ManagerEditEvent";
import UserBookEvent from "./pages/UserBookEvent";
import ManagerManageEvent from "./pages/ManagerManageEvent";
import HomePage from './pages/HomePage';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <>
      {! user && <Header />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LoginPage />} />
          
          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book/:eventId"
            element={
              <ProtectedRoute allowedRoles={["USER", "ADMIN", "MANAGER"]}>
                <UserBookEvent />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/profile"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/create-event"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerCreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/events"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerManageEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/edit-event/:eventId"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerEditEvent />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <div>
                  <AdminNavBar />
                  <Outlet />
                </div>
              </ProtectedRoute>
            }
          >
            <Route index element={<div />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="managers" element={<AdminManagersPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;