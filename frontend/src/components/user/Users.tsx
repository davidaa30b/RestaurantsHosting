import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import {
  UserData,
  UsersData,
  getCurrentUser,
} from "../../service/users-service";
import "../../css/Restaurant.css";
import { useEffect, useState } from "react";
type Props = {};

const Users = (props: Props) => {
  const { users } = useLoaderData() as UsersData;
  const [curUser, setCurUser] = useState<UserData>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurUser = async () => {
      const curUser = await getCurrentUser();
      if (curUser) {
        setCurUser(curUser);
      }
    };
    fetchCurUser();
  }, []);

  return (
    <div className="restaurant-list-container">
      <h1>Users</h1>

      <table>
        <tr>
          <td>
            {curUser &&
              curUser.role === "admin" &&
              users.map((u) => (
                <div
                  key={u._id}
                  className="restaurant-item"
                  onClick={(event) => navigate("/users/" + u._id)}
                >
                  <strong>Id: </strong> {u._id}, <strong>Username :</strong>{" "}
                  {u.username}, <strong>Name:</strong> {u.firstName}{" "}
                  {u.lastName}
                </div>
              ))}
          </td>
        </tr>
      </table>
      <hr />
      <Outlet />
      <div>
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Users;
