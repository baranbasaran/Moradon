import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { FaEnvelope, FaLock } from "react-icons/fa";
import FormInput from "../components/common/FormInput";
import LoadingButton from "../components/common/LoadingButton";
import AuthLayout from "../components/layouts/AuthLayout";
import {
  useFormValidation,
  commonValidationRules,
} from "../hooks/useFormValidation";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { errors, validate, clearError } = useFormValidation([
    commonValidationRules.required(
      "identifier",
      "Email or username is required"
    ),
    commonValidationRules.required("password", "Password is required"),
    commonValidationRules.minLength(
      "password",
      6,
      "Password must be at least 6 characters"
    ),
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearError(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    try {
      await dispatch(login(formData)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const footer = (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Don't have an account?{" "}
      <Link
        to="/auth/signup"
        className="font-semibold text-primary hover:text-primary-600 transition-colors"
      >
        Sign up
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to Moradon"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email or Username"
          name="identifier"
          type="text"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          icon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your email or username"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your password"
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            {error}
          </div>
        )}

        <LoadingButton
          isLoading={status === "loading"}
          loadingText="Signing in..."
          type="submit"
        >
          Sign In
        </LoadingButton>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
