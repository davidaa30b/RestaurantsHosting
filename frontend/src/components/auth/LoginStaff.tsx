import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../css/FormDetails.css"; // Ensure this path is correct
import { useAuth } from "./AuthContext";
import {
  ErrorLoginStaff,
  getStaffMemberByLoginToken,
} from "../../service/staff-services";

export const LoginStaff = () => {
  const [loginToken, setLoginToken] = useState<string>("");
  const [errors, setErrors] = useState<ErrorLoginStaff>({});
  const { loginStaff } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let hasError = false;
    const errors: ErrorLoginStaff = {};

    if (!(await getStaffMemberByLoginToken(loginToken))) {
      hasError = true;
      errors.loginToken = "The following login code is invalid!";
    }

    if (!hasError) {
      try {
        loginStaff(loginToken);
        console.log("Staff logged in successfully");
        navigate("/home");
      } catch (error) {
        console.error("Login error:", error);
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
            Login Token:
            <input
              type="text"
              value={loginToken}
              onChange={(e) => setLoginToken(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.loginToken && (
            <div className="error-message">{errors.loginToken}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};
