import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/SignInModal.css";
import { login } from "../redux/authSlice";

const SignInModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize formData with default values
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleClose = () => {
    onClose();
    navigate("/"); // Redirect to the welcome page when closed
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare credentials
    const credentials = {
      identifier: formData.identifier,
      password: formData.password,
    };

    dispatch(login(credentials));
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
                autoComplete="username"
                type="text"
                id="signin-identifier"
                name="identifier"
                placeholder=" "
                value={formData.identifier}
                onChange={handleChange}
                required
              />
              <label className="input-label" htmlFor="signin-identifier">
                Email, Username, or Phone
              </label>
            </div>
            <div className="input-container">
              <input
                name="password"
                type="password"
                id="signin-password"
                placeholder=" "
                onChange={handleChange}
                value={formData.password}
                autoComplete="current-password"
                required
              />
              <label className="input-label" htmlFor="signin-password">
                Password
              </label>
            </div>
            <button type="submit" className="button-primary">
              Log in
            </button>
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
