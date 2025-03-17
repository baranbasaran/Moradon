import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpModal.css";

const SignUpModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    name: "",
    username: "",
  });

  const [useEmail, setUseEmail] = useState(true);
  const [step, setStep] = useState(1);

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleUseEmail = () => {
    setUseEmail(!useEmail);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const birthDate = `${formData.birthYear}-${(
      "0" + formData.birthMonth
    ).slice(-2)}-${("0" + formData.birthDay).slice(-2)}`;

    if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
      console.error("Invalid date");
      return;
    }

    const payload = {
      ...formData,
      birthDate,
    };

    dispatch(signup(payload)).then((result) => {
      if (!result.error) {
        navigate("/profile");
        onClose();
      }
    });
  };

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal-container">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="modal-header">Create your account</div>
          <div className="modal-content">
            {step === 1 ? (
              <>
                <div className="input-container">
                  <input
                    type={useEmail ? "email" : "tel"}
                    name={useEmail ? "email" : "phone"}
                    placeholder=" "
                    value={useEmail ? formData.email : formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label">
                    {useEmail ? "Email" : "Phone"}
                  </label>
                </div>
                <button
                  type="button"
                  className="toggle-input"
                  onClick={toggleUseEmail}
                >
                  Use {useEmail ? "phone" : "email"} instead
                </button>
                <button
                  type="button"
                  className="button-primary"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <div className="input-container">
                  <input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label">Name</label>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    name="username"
                    placeholder=" "
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label">Username</label>
                </div>
                <div className="input-container">
                  <input
                    type="password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label">Password</label>
                </div>
                <div className="date-of-birth">
                  <h4>Date of birth</h4>
                  <p>
                    This will not be shown publicly. Confirm your own age, even if
                    this account is for a business, a pet, or something else.
                  </p>
                  <div className="date-inputs">
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="birthDay"
                      placeholder="Day"
                      min="1"
                      max="31"
                      value={formData.birthDay}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="number"
                      name="birthYear"
                      placeholder="Year"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.birthYear}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="button-primary">
                  {loading ? "Creating account..." : "Sign up"}
                </button>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        </form>
        <div className="modal-footer">
          <span>
            Already have an account?{" "}
            <button onClick={() => navigate("/auth/sign-in")} className="link-button">
              Sign in
            </button>
          </span>
          <button className="button-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;
