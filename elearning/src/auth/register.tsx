import React from "react";
import { checkEmail, checkPassword } from "../helper/helper";
import LoginApi from "../api/login";

export default function Register() {
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    sector: "",
    confirmPassword: "",
  });

  const [error, setError] = React.useState({
    usernameErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
    sectorError: "",
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, username: value }));

    setError((prev) => ({
      ...prev,
      usernameErr: checkEmail(value) ? "" : "Invalid email format",
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, password: value }));

    setError((prev) => ({
      ...prev,
      passwordErr: checkPassword(value)
        ? ""
        : "Password must be at least 6 characters long",
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, confirmPassword: value }));

    setError((prev) => ({
      ...prev,
      confirmPasswordErr:
        value === formData.password ? "" : "Passwords do not match",
    }));
  };

  const handleChangeSector = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sector: value,
    }));

    if (!formData.sector) {
      setError((prev) => ({
        ...prev,
        sectorError: "Sector field is required",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkVal = checkValidation();

    if (!checkVal) {
      return;
    }
    const data = {
      username: formData.username,
      password: formData.password,
      sector: formData.sector,
    };
    const register = LoginApi.userRegister(data);
  };

  const checkValidation = () => {
    let isValid = true;
    if (!checkEmail(formData.username)) {
      setError((prev) => ({
        ...prev,
        usernameErr: "Email id is required",
      }));
      isValid = false;
    }

    if (!checkPassword(formData.password)) {
      setError((prev) => ({
        ...prev,
        passwordErr: "Password must be at least 6 characters long",
      }));

      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPasswordErr: "Password doesnot match",
      }));
      isValid = false;
    }

    return isValid;
  };

  const resetErrorMessage = () => {
    setError({
      usernameErr: "",
      passwordErr: "",
      confirmPasswordErr: "",
      sectorError: "",
    });
  };

  return (
    <div className="container mt-5">
      <div className="col col-4 mx-auto">
        <h2 className="mb-5">eLearning</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-2"
            value={formData.username}
            onChange={handleUsernameChange}
            placeholder="Email"
          />
          {error.usernameErr && (
            <div className="text-danger">{error.usernameErr}</div>
          )}

          <input
            type="password"
            className="form-control mb-2"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          {error.passwordErr && (
            <div className="text-danger">{error.passwordErr}</div>
          )}

          <input
            type="password"
            className="form-control mb-2"
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm Password"
          />
          {error.confirmPasswordErr && (
            <div className="text-danger">{error.confirmPasswordErr}</div>
          )}

          <select
            className="form-control mb-2"
            value={formData.sector}
            onChange={handleChangeSector}
          >
            <option value="">Select option</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
          </select>

          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}
