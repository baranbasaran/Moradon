// src/App.js
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import WelcomePage from "./pages/WelcomePage";
import PrivateRoute from "./components/PrivateRoute";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import HomePage from "./pages/HomePage";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const isSignIn = location.pathname === "/auth/sign-in";
  const isSignUp = location.pathname === "/auth/sign-up";

  const closeModal = () => {
    navigate("/");
  };

  return (
    <div className="app-layout">
      {isAuthenticated && <div className="sidebar">
        {/* Add your sidebar content here */}
      </div>}
      <div className="content">
        <Routes location={background || location}>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/auth/sign-in" element={<WelcomePage />} />
              <Route path="/auth/sign-up" element={<WelcomePage />} />
              <Route path="*" element={<WelcomePage />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
            </>
          )}
        </Routes>
      </div>
      {isSignIn && <SignInModal onClose={closeModal} />}
      {isSignUp && <SignUpModal onClose={closeModal} />}
    </div>
  );
}

export default App;
