import assert from "node:assert/strict";
import test from "node:test";
import {
  getPasswordStrength,
  validateLoginForm,
  validateRegisterForm,
} from "@/lib/auth/validators";

test("register validation requires name, email, password, and matching confirmation", () => {
  assert.deepEqual(
    validateRegisterForm({ name: "", email: "", password: "short", confirm: "different" }),
    {
      name: "Name is required",
      email: "Email is required",
      password: "Password must be at least 8 characters",
      confirm: "Passwords do not match",
    }
  );
});

test("register validation accepts a complete developer signup form", () => {
  assert.deepEqual(
    validateRegisterForm({
      name: "Jane Developer",
      email: "jane@example.com",
      password: "StrongPass1!",
      confirm: "StrongPass1!",
    }),
    {}
  );
});

test("login validation requires email and password", () => {
  assert.deepEqual(validateLoginForm({ email: "", password: "" }), {
    email: "Email is required",
    password: "Password is required",
  });
});

test("password strength scores length, uppercase, number, and symbol", () => {
  assert.deepEqual(getPasswordStrength("weak").label, "Weak");
  assert.deepEqual(getPasswordStrength("Password1").label, "Good");
  assert.deepEqual(getPasswordStrength("Password1!").label, "Strong");
});
