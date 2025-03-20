export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthMap: Record<number, PasswordStrength> = {
    0: { score: 0, label: "Very Weak", color: "bg-red-500" },
    1: { score: 1, label: "Weak", color: "bg-orange-500" },
    2: { score: 2, label: "Fair", color: "bg-yellow-500" },
    3: { score: 3, label: "Good", color: "bg-blue-500" },
    4: { score: 4, label: "Strong", color: "bg-green-500" },
    5: { score: 5, label: "Very Strong", color: "bg-green-600" },
  };

  return strengthMap[score] || strengthMap[0];
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
};

export const isPasswordStrong = (password: string): boolean => {
  return validatePassword(password).length === 0;
};
