import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmail, checkPassword, setStoredUser } from "../helper/helper";
import LoginApi from "../api/login";
import Loading from "../helper/Loading";

interface ErrorState {
  usernameErr: string;
  passwordErr: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorState>({
    usernameErr: "",
    passwordErr: "",
  });
  const [loggingIn, setLoggingIn] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    LoginApi.getAppData().then((res) => {
      if (res?.success) {
        localStorage.setItem("sector", JSON.stringify(res.data));
      }
    });
  }, []);

  const formValidation = () => {
    let isValid = true;
    const next: ErrorState = { usernameErr: "", passwordErr: "" };
    if (!checkEmail(username)) {
      next.usernameErr = "Invalid email address";
      isValid = false;
    }
    if (!checkPassword(password)) {
      next.passwordErr = "Password must be 6–16 characters";
      isValid = false;
    }
    setError(next);
    return isValid;
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formValidation()) return;
    setFormError("");
    try {
      setLoggingIn(true);
      const login = await LoginApi.userLogin(username, password);
      if (login?.loginUser) {
        // merge top-level token in case backend separates it from the user object
        const userData = {
          ...login.loginUser,
          token: login.loginUser.token ?? login.token,
          subjectList: login?.subjectList || [],
        };
        setStoredUser(userData);
        if (userData.userRole === "sup") {
          navigate("/admin");
        } else if (userData.userRole === "teacher") {
          navigate("/teacher");
        } else if (userData.loginStep === 1) {
          navigate("/login-step");
        } else {
          navigate("/dashboard");
        }
        // Left loggingIn true on purpose — this component unmounts on
        // navigation, so there's no "form flashes back" moment to avoid.
        return;
      }
      const message = Array.isArray(login?.message)
        ? login.message.join(", ")
        : login?.message;
      setFormError(message || "Invalid email or password.");
      setLoggingIn(false);
    } catch (err) {
      console.error("Login failed:", err);
      setFormError("Something went wrong. Please try again.");
      setLoggingIn(false);
    }
  };

  if (loggingIn) return <Loading />;

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-inner">
          <div className="brand-logo">
            eLearning <span className="logo-badge">Pro</span>
          </div>
          <h2 className="brand-headline">
            Learn smarter,
            <br />
            grow faster.
          </h2>
          <p className="brand-sub">
            Access thousands of courses taught by expert instructors and take
            your skills to the next level.
          </p>
          <ul className="brand-features">
            <li>
              <span className="check-icon">✓</span>Expert-led video courses
            </li>
            <li>
              <span className="check-icon">✓</span>Learn at your own pace
            </li>
            <li>
              <span className="check-icon">✓</span>Certificates upon completion
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-mobile">eLearning</div>
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {formError && (
            <div className="auth-form-error">
              <span>⚠</span> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="username">Email address</label>
              <input
                id="username"
                type="email"
                placeholder="you@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={error.usernameErr ? "is-error" : ""}
              />
              {error.usernameErr && (
                <span className="field-error">⚠ {error.usernameErr}</span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error.passwordErr ? "is-error" : ""}
              />
              {error.passwordErr && (
                <span className="field-error">⚠ {error.passwordErr}</span>
              )}
            </div>

            <div className="auth-forgot">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="auth-btn">
              Sign in
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?<a href="/register">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
