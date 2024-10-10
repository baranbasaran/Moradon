// src/App.js
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfilePage from "./pages/UserProfilePage";
import WelcomePage from "./pages/WelcomePage";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background; // Capture the background state

  // Check the modal's active state based on URL
  const isSignIn = location.pathname === "/auth/sign-in";
  const isSignUp = location.pathname === "/auth/sign-up";

  // To close modals and revert URL, we handle clicks on the background
  const closeModal = () => {
    navigate("/"); // Redirects to main page when modal is closed
  };

  return (
    <div className="app-layout">
      {isAuthenticated && <Sidebar />} {/* Sidebar visible only if logged in */}
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
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<UserProfilePage />} />
            </>
          )}
        </Routes>
      </div>
      {/* Conditionally show modals without changing the background */}
      {isSignIn && <SignInModal onClose={closeModal} />}
      {isSignUp && <SignUpModal onClose={closeModal} />}
    </div>
  );
}

export default App;
