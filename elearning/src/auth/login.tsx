import { useCallback, useEffect, useState } from "react";
import { checkEmail, checkPassword } from "../helper/helper";
import LoginApi from "../api/login";
import Loading from "../helper/Loading";

interface ErrorState {
  usernameErr: string;
  passwordErr: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [appData, setAppData] = useState();

  const fetchAppData = useCallback(async () => {
    try {
      const res = await LoginApi.getAppData();
      if (res?.success) {
        setAppData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

  const [error, setError] = useState<ErrorState>({
    usernameErr: "",
    passwordErr: "",
  });

  const formValidation = () => {
    let isValid = true;

    setError({
      usernameErr: "",
      passwordErr: "",
    });

    if (!checkEmail(username)) {
      isValid = false;

      setError((prev) => ({
        ...prev,
        usernameErr: "Invalid email format",
      }));
    }

    if (!checkPassword(password)) {
      isValid = false;

      setError((prev) => ({
        ...prev,
        passwordErr: "Password must be between 6 and 16 characters",
      }));
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = formValidation();

    if (!isFormValid) return;

    try {
      const login = await LoginApi.userLogin(username, password);

      console.log("Login successful", login);

      // Example:
      // localStorage.setItem("token", login.token);
      // navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="col col-4 mx-auto">
        {!appData && <Loading />}
        <h2 className="col col-md-6 mx-auto mb-5">eLearning</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Email
            </label>

            <input
              type="email"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {error.usernameErr && (
              <div className="text-danger mt-1">{error.usernameErr}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error.passwordErr && (
              <div className="text-danger mt-1">{error.passwordErr}</div>
            )}
          </div>
          <div className="mb-3">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <div className="mb-5 mt-3">
          <a href="/register">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}
