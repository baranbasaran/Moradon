import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
  placeholder?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  passwordStrength?: {
    score: number;
    label: string;
    color: string;
  };
  required?: boolean;
  min?: string;
  max?: string;
  ariaLabel?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  icon,
  placeholder,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  passwordStrength,
  required,
  min,
  max,
  ariaLabel,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 ${
            showPasswordToggle ? "pr-10" : "pr-3"
          } py-2 border ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-primary"
          } rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors`}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-label={ariaLabel || label}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      {passwordStrength && (
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
              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormInput;
