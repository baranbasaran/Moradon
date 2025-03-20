import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import { RootState } from "./redux/store";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {isAuthenticated && <Sidebar />}
      <div className={`${isAuthenticated ? "ml-64" : ""} min-h-screen`}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <WelcomePage />}
          />
          <Route
            path="/auth/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/auth/signup"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
