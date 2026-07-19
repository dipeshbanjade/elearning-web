import { useState } from "react";
import {
  checkEmail,
  checkPassword,
  storeAppDataInLocalstorage,
  setStoredUser,
} from "../helper/helper";
import LoginApi from "../api/login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    catId: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    fullnameErr: "",
    usernameErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
    catIdError: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    storeAppDataInLocalstorage()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const set = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const register = await LoginApi.userRegister({
        username: formData.username,
        password: formData.password,
        catId: formData.catId,
        confirmPassword: formData.confirmPassword,
        fullname: formData.fullname,
      });
      if (register?.loginUser) {
        setStoredUser(register.loginUser);
        if (register.loginUser.loginStep === 1) navigate("/login-step");
      }
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const validate = () => {
    const next = {
      fullnameErr: "",
      usernameErr: "",
      passwordErr: "",
      confirmPasswordErr: "",
      catIdError: "",
    };
    let ok = true;

    if (formData.fullname.trim().length < 3) {
      next.fullnameErr = "Full name must be at least 3 characters";
      ok = false;
    }
    if (!checkEmail(formData.username)) {
      next.usernameErr = "Enter a valid email address";
      ok = false;
    }
    if (!checkPassword(formData.password)) {
      next.passwordErr = "Password must be 6–16 characters";
      ok = false;
    }
    if (formData.password !== formData.confirmPassword) {
      next.confirmPasswordErr = "Passwords do not match";
      ok = false;
    }
    if (!formData.catId) {
      next.catIdError = "Please select a category";
      ok = false;
    }

    setError(next);
    return ok;
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-inner">
          <div className="brand-logo">
            eLearning <span className="logo-badge">Pro</span>
          </div>
          <h2 className="brand-headline">
            Start your learning<br />journey today.
          </h2>
          <p className="brand-sub">
            Join thousands of learners already growing their skills with
            expert-led courses and hands-on projects.
          </p>
          <ul className="brand-features">
            <li><span className="check-icon">✓</span>Free to get started</li>
            <li><span className="check-icon">✓</span>Personalised learning path</li>
            <li><span className="check-icon">✓</span>Track your progress</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-mobile">eLearning</div>
            <h1>Create account</h1>
            <p>It's free and only takes a minute</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="fullname">Full name</label>
              <input
                id="fullname"
                type="text"
                placeholder="Jane Doe"
                value={formData.fullname}
                onChange={(e) => set("fullname", e.target.value)}
                className={error.fullnameErr ? "is-error" : ""}
              />
              {error.fullnameErr && (
                <span className="field-error">⚠ {error.fullnameErr}</span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="username">Email address</label>
              <input
                id="username"
                type="email"
                placeholder="you@example.com"
                value={formData.username}
                onChange={(e) => set("username", e.target.value)}
                className={error.usernameErr ? "is-error" : ""}
              />
              {error.usernameErr && (
                <span className="field-error">⚠ {error.usernameErr}</span>
              )}
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => set("password", e.target.value)}
                  className={error.passwordErr ? "is-error" : ""}
                />
                {error.passwordErr && (
                  <span className="field-error">⚠ {error.passwordErr}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className={error.confirmPasswordErr ? "is-error" : ""}
                />
                {error.confirmPasswordErr && (
                  <span className="field-error">⚠ {error.confirmPasswordErr}</span>
                )}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="catId">Category</label>
              <select
                id="catId"
                value={formData.catId}
                onChange={(e) => set("catId", e.target.value)}
                className={error.catIdError ? "is-error" : ""}
              >
                <option value="">Select a category…</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {error.catIdError && (
                <span className="field-error">⚠ {error.catIdError}</span>
              )}
            </div>

            <button type="submit" className="auth-btn">Create account</button>
          </form>

          <div className="auth-switch">
            Already have an account?<a href="/">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
