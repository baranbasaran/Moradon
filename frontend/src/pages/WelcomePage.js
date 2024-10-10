import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/WelcomePage.css"; // Add your custom styling
import logo from "../assets/Moradon_transparent-.svg"; // Import the logo

const WelcomePage = () => {
  const navigate = useNavigate();

  const openSignIn = () => {
    navigate("/auth/sign-in");
  };

  const openSignUp = () => {
    navigate("/auth/sign-up");
  };
  return (
    <div className="welcome-page">
      {/* Left side with the logo */}
      <div className="welcome-logo-container">
        <div className="welcome-logo">
          <img src={logo} alt="logo" />
        </div>
      </div>

      {/* Right side with the content */}
      <div className="welcome-content-container">
        <div className="welcome-content">
          <h1>Discover the world of books</h1>
          <p>Join the best book exchange community</p>
          <div className="welcome-buttons">
            <button className="signup-google" onClick={openSignIn}>
              Sign in with Google
            </button>
            <button className="signup-apple" onClick={openSignIn}>
              Sign in with Apple
            </button>
            <div className="welcome-separator">or</div>
            <button className="create-account" onClick={openSignUp}>
              Create account
            </button>
          </div>
          <p className="login-message">
            Already have an account? <a onClick={openSignIn}>Sign in</a>
          </p>
        </div>

        {/* Footer (if needed) */}
        <footer className="welcome-footer">
          <p>Welcome to Moradon</p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
