import React, { useEffect, useState } from "react";
import {
  UserData,
  getAdmin,
  getCurrentUser,
} from "../../service/users-service";
import "../../css/Mailing.css";
import { useNavigate } from "react-router-dom";

export const ApplyForManager = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserData>();
  const [admin, setAdmin] = useState<UserData>();

  useEffect(() => {
    const getUsers = async () => {
      const user = await getCurrentUser();
      const admin = await getAdmin();
      setCurrentUser(user);
      setAdmin(admin);
    };

    getUsers();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // Prevent the default form submission behavior
    const confirmSend = window.confirm(
      "Are you sure you want to send this email?"
    );

    if (confirmSend) {
      console.log(message);
      fetch("http://localhost:8080/apply-for-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to apply for manager");
          }
          return response.json();
        })
        .then((newApplication) => {
          console.log("New application has been sent:", newApplication);
        })
        .catch((error) => {
          console.error("Error sending application:", error);
        });
      alert("You have sent your email successfully!");
      navigate("/home");
    }
  }

  return (
    <div className="apply-for-manager-container">
      <p>
        State your reasons to the admins of the page why you are adequate for
        manager of your own restaurant
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label>
              From:
              <input value={currentUser?.email} disabled={true} />
            </label>
          </div>
          <div>
            <label>
              Name:
              <input
                value={`${currentUser?.firstName} ${currentUser?.lastName}`}
                disabled={true}
              />
            </label>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>
              To:
              <input value={admin?.email} disabled={true} />
            </label>
          </div>
          <div>
            <label>
              Name:
              <input
                value={`${admin?.firstName} ${admin?.lastName}`}
                disabled={true}
              />
            </label>
          </div>
        </div>
        <label>
          Message
          <textarea onChange={(e) => setMessage(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
