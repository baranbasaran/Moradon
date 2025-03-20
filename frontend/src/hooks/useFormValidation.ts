import { useState } from "react";

interface ValidationRule {
  field: string;
  validate: (value: any, formData: Record<string, any>) => boolean;
  message: string;
}

interface ValidationResult {
  errors: Record<string, string>;
  validate: (formData: Record<string, any>) => boolean;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearError: (field: string) => void;
}

export const useFormValidation = (
  rules: ValidationRule[]
): ValidationResult => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    rules.forEach((rule) => {
      if (!rule.validate(formData[rule.field], formData)) {
        newErrors[rule.field] = rule.message;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return { errors, validate, setErrors, clearError };
};

// Common validation rules
export const commonValidationRules = {
  required: (
    field: string,
    message: string = "This field is required"
  ): ValidationRule => ({
    field,
    validate: (value: any) => value && value.toString().trim().length > 0,
    message,
  }),
  email: (field: string): ValidationRule => ({
    field,
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Please enter a valid email address",
  }),
  minLength: (
    field: string,
    min: number,
    message?: string
  ): ValidationRule => ({
    field,
    validate: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  passwordMatch: (field: string, passwordField: string): ValidationRule => ({
    field,
    validate: (value: string, formData: Record<string, any>) =>
      value === formData[passwordField],
    message: "Passwords do not match",
  }),
  age: (field: string, minAge: number): ValidationRule => ({
    field,
    validate: (value: string) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= minAge;
    },
    message: `You must be at least ${minAge} years old`,
  }),
};
