import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Elections from "./pages/elections/Elections";
import ElectionForm from "./pages/elections/ElectionForm";
import ElectionDetail from "./pages/elections/ElectionDetail";
import Candidates from "./pages/candidates/Candidates";
import CandidateForm from "./pages/candidates/CandidateForm";
import CandidateDetail from "./pages/candidates/CandidateDetail";
import Votes from "./pages/votes/Votes";
import Results from "./pages/results/Results";
import ResultDetail from "./pages/results/ResultDetail";
import Users from "./pages/users/Users";
import UserForm from "./pages/users/UserForm";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ElectionSearch from "./pages/elections/ElectionSearch";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/auth/ChangePassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForbiddenPage from "./pages/untils/ForbiddenPage";
import UserDashboard from "./pages/UserDashboard";
import VoteHistory from "./pages/votes/VoteHistory";
import UserElections from "./pages/UserElections";

function App() {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setInitialized(true);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />

              <Route path="elections">
                <Route index element={<Elections />} />
                <Route path="new" element={<ElectionForm />} />
                <Route path=":id" element={<ElectionDetail />} />
                <Route path=":id/edit" element={<ElectionForm />} />
              </Route>

              <Route path="user-elections">
                <Route index element={<UserElections />} />
              </Route>

              <Route path="candidates">
                <Route index element={<Candidates />} />
                <Route path="new" element={<CandidateForm />} />
                <Route path=":id" element={<CandidateDetail />} />
                <Route path=":id/edit" element={<CandidateForm />} />
              </Route>

              <Route path="votes">
                <Route index element={<Votes />} />
              </Route>
              <Route path="vote-history">
                <Route index element={<VoteHistory />} />
              </Route>

              <Route path="results">
                <Route index element={<Results />} />
                <Route path=":id" element={<ResultDetail />} />
              </Route>

              <Route path="users">
                <Route index element={<Users />} />
                <Route path="new" element={<UserForm />} />
                <Route path=":id/edit" element={<UserForm />} />
              </Route>
              <Route path="/join-election" element={<ElectionSearch />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
