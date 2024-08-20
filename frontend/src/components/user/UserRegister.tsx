import { useState } from "react";
import { GenderType, UserErrors, UserData } from "../../service/users-service";
import "../../css/Layout.css";
import "../../css/FormDetails.css";
import { useNavigate } from "react-router-dom";

export const UserRegister = () => {
  const navigator = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<GenderType>("male");
  const [image, setImage] = useState<string>("");

  const [errors, setErrors] = useState<UserErrors>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const passwordRegex = /^(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors: UserErrors = {};
    let hasError = false;
    if (
      firstName === "" ||
      email === "" ||
      username === "" ||
      password === ""
    ) {
      errors.conclude =
        "Error. First and last name, username and password fields must be filled .";
      hasError = true;
    }

    if (username.length > 15) {
      errors.username =
        "Error. Username length is over the limit of 15 characters.";
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      errors.password =
        "Error. Password must include at least one number, letter, and special character.";
      hasError = true;
    }

    if (password.length < 8) {
      errors.password = "Error. Password length must be over 8 characters.";
      hasError = true;
    }

    if (!emailRegex.test(email)) {
      errors.email = "Error. The entered email is invalid.";
      hasError = true;
    }

    if (hasError) {
      setErrors(errors);
    } else {
      setErrors({});
      let inputUser: UserData = {
        firstName,
        lastName,
        username,
        password,
        gender,

        email,
        role: "user",
        status: "active",
        registerDate: new Date().toLocaleString("en-GB"),
        latestModification: new Date().toLocaleString("en-GB"),
        _id: "",
        authentication: {
          sessionToken: "",
        },
      };

      if (image === "") {
        if (gender === "male") {
          inputUser.image =
            "https://www.nccm.ca/wp-content/uploads/2023/09/AdobeStock_579739205-scaled.jpeg";
        }

        if (gender === "female") {
          inputUser.image =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLhLGHp6ABuZuqKG0gGIsXMIOAtZoUuE-SKQ&s";
        }
      } else {
        inputUser.image = image;
      }

      fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputUser),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add user");
          }
          return response.json();
        })
        .then((newUser) => {
          console.log("New user added:", newUser);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });

      alert("You have registered successfully!");
      navigator("/login");
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">
            First Name (required):
            <input
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Last Name :
            <input
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Username (required):
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Password (required):
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Gender:
            <select
              onChange={(e) => setGender(e.target.value as GenderType)}
              className="form-input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Image URL:
            <input
              onChange={(e) => setImage(e.target.value)}
              className="form-input"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Email (required):
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </label>
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
        {errors.conclude && (
          <div className="error-message">{errors.conclude}</div>
        )}
      </form>
    </div>
  );
};
