import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/SignInModal.css"; // Ensure the CSS for modal styling is applied
import { login } from "../redux/authSlice";
import { useState } from "react";
const SignInModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const handleClose = () => {
    onClose();
    navigate("/"); // Redirect to the welcome page when closed
  };
  const [useEmail, setUseEmail] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const toggleUseEmail = () => {
    setUseEmail(!useEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal-container">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="modal-header">Sign in to Moradon</div>
          <div className="modal-content">
            <div className="input-container">
              <input
                autoComplete="new-contact"
                type={useEmail ? "email" : "text"}
                id="signup-contact"
                name={useEmail ? "email" : "phone"}
                placeholder=" "
                value={useEmail ? formData.email : formData.phone}
                onChange={handleChange}
                required
              />
              <label className="input-label" htmlFor="signup-contact">
                {useEmail ? "Email" : "Phone"}
              </label>
            </div>
            <div className="input-container">
              <input
                name="password"
                type="password"
                id="signin-password"
                placeholder=" "
                onChange={handleChange}
              />
              <label className="input-label" htmlFor="signin-password">
                Password
              </label>
            </div>
            <p className="toggle-contact" onClick={toggleUseEmail}>
              {useEmail ? "Use phone instead" : "Use email instead"}
            </p>
            <button className="button-primary">Log in</button>
          </div>
        </form>
        <a href="#" className="forgot-password">
          Forgot password?
        </a>
        <div className="modal-footer">
          <span>
            Don't have an account? <a href="/auth/sign-up">Sign up</a>
          </span>
          <button className="button-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SignInModal;
