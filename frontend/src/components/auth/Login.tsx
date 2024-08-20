import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LoginData,
  LoginErrors,
  getUserByEmail,
} from "../../service/users-service";
import "../../css/FormDetails.css"; // Ensure this path is correct
import { useAuth } from "./AuthContext";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let loginUser: LoginData = {} as LoginData;
    let hasError = false;
    const errors: LoginErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || password === "") {
      hasError = true;
      errors.conclude = "All fields must be fulfilled";
    }

    if (!emailRegex.test(email)) {
      errors.email = "Error. The entered email is invalid.";
      hasError = true;
    }

    if (!(await getUserByEmail(email))) {
      errors.email = "Email is not registered";
      hasError = true;
    }

    if (!hasError) {
      setErrors({});
      loginUser.email = email;
      loginUser.password = password;

      if (await login(loginUser)) {
        console.log("Logged in successfully");
        navigate("/home");
      } else {
        errors.password = "Password is incorrect";
        setErrors(errors);
      }
    } else {
      setErrors(errors);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
        {errors.conclude && (
          <div className="error-message">{errors.conclude}</div>
        )}

        <div className="register-link" onClick={() => navigate("/register")}>
          If you do not have an account, register here.
        </div>
      </form>
    </div>
  );
};
