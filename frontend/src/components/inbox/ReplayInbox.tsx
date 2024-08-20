import { Form } from "react-router-dom";
import "../../css/Inboxes.css";
import { useEffect, useState } from "react";
import {
  UserData,
  getAdmin,
  getCurrentUser,
} from "../../service/users-service";
type Props = {};

const ReplayInbox = (props: Props) => {
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

  return (
    <div className="replay-to-manager-container">
      <div className="form-row">
        <div>
          <label>
            From:
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
      <div className="form-row">
        <div>
          <label>
            To:
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
      <Form method="POST">
        <label>
          Approve : <input name="approve" type="checkbox" />
        </label>
        <label>
          Feedback : <textarea name="message" />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default ReplayInbox;
