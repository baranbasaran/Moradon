import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCalendar,
  FaPhone,
} from "react-icons/fa";
import FormInput from "../components/common/FormInput";
import LoadingButton from "../components/common/LoadingButton";
import AuthLayout from "../components/layouts/AuthLayout";
import {
  useFormValidation,
  commonValidationRules,
} from "../hooks/useFormValidation";
import {
  validatePassword,
  calculatePasswordStrength,
} from "../utils/passwordUtils";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    name: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Very Weak",
    color: "bg-red-500",
  });

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    }
  }, [formData.password]);

  const { errors, validate, clearError } = useFormValidation([
    commonValidationRules.required("username", "Username is required"),
    commonValidationRules.minLength(
      "username",
      3,
      "Username must be at least 3 characters"
    ),
    commonValidationRules.required("email", "Email is required"),
    commonValidationRules.email("email"),
    commonValidationRules.required("password", "Password is required"),
    commonValidationRules.required(
      "confirmPassword",
      "Please confirm your password"
    ),
    commonValidationRules.required("birthDate", "Birth date is required"),
    commonValidationRules.required("name", "Display name is required"),
    commonValidationRules.required("phoneNumber", "Phone number is required"),
    {
      field: "phoneNumber",
      validate: (value) => /^\+?[0-9]{10,15}$/.test(value),
      message: "Please enter a valid phone number",
    },
    {
      field: "password",
      validate: (value) => {
        const passwordErrors = validatePassword(value);
        return passwordErrors.length === 0;
      },
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    },
    commonValidationRules.passwordMatch("confirmPassword", "password"),
    commonValidationRules.age("birthDate", 13),
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    try {
      const { confirmPassword, ...signupData } = formData;
      const signupCredentials = {
        ...signupData,
        birthDate: new Date(signupData.birthDate).toISOString().split("T")[0],
      };
      await dispatch(signup(signupCredentials)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const footer = (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Already have an account?{" "}
      <Link
        to="/auth/login"
        className="font-semibold text-primary hover:text-primary-600 transition-colors"
      >
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Moradon and start sharing with your community"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          icon={<FaUser className="h-5 w-5 text-gray-400" />}
          placeholder="Choose a username"
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your email"
        />

        <div>
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<FaLock className="h-5 w-5 text-gray-400" />}
            placeholder="Create a password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Password strength:
                </span>
                <span className={`font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<FaLock className="h-5 w-5 text-gray-400" />}
          placeholder="Confirm your password"
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <FormInput
          label="Birth Date"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          error={errors.birthDate}
          icon={<FaCalendar className="h-5 w-5 text-gray-400" />}
        />

        <FormInput
          label="Display Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={<FaIdCard className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your display name"
        />

        <FormInput
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          icon={<FaPhone className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your phone number"
        />

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            {error}
          </div>
        )}

        <LoadingButton
          isLoading={status === "loading"}
          loadingText="Creating account..."
          type="submit"
        >
          Create Account
        </LoadingButton>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
