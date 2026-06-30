export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-error" };
  if (score === 2) return { score, label: "Fair", color: "bg-warning" };
  if (score === 3) return { score, label: "Good", color: "bg-accent" };
  return { score, label: "Strong", color: "bg-success" };
}

export function validateRegisterForm(form: RegisterFormValues) {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  if (form.password !== form.confirm) errors.confirm = "Passwords do not match";

  return errors;
}

export function validateLoginForm(form: LoginFormValues) {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  if (!form.email.trim()) errors.email = "Email is required";
  if (!form.password) errors.password = "Password is required";

  return errors;
}
