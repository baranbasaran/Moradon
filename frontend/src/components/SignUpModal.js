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
            {step === 1 && (
              <>
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
                    autoComplete="new-password"
                    type="password"
                    id="signup-password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label" htmlFor="signup-password">
                    Password
                  </label>
                </div>
                <p className="toggle-contact" onClick={toggleUseEmail}>
                  {useEmail ? "Use phone instead" : "Use email instead"}
                </p>

                <div className="dob-section">
                  <p className="dob-title">Date of birth</p>
                  <p className="dob-description">
                    This will not be shown publicly. Confirm your own age, even
                    if this account is for a business, a pet, or something else.
                  </p>
                  <div className="dob-fields">
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Month
                      </option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Day
                      </option>
                      {[...Array(31).keys()].map((d) => (
                        <option key={d + 1} value={d + 1}>
                          {d + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="birthYear"
                      value={formData.birthYear}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Year
                      </option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={2023 - i}>
                          {2023 - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  className="button-primary"
                  type="button"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="input-container">
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label" htmlFor="signup-name">
                    Name
                  </label>
                </div>

                <div className="input-container">
                  <input
                    type="text"
                    id="signup-username"
                    name="username"
                    placeholder=" "
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <label className="input-label" htmlFor="signup-username">
                    Username
                  </label>
                </div>

                <button
                  className="button-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </>
            )}

            {error && <p className="error-text">{error}</p>}
          </div>

          <div className="modal-footer">
            <button
              className="button-secondary"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpModal;
