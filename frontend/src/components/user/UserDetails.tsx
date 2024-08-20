import { Form, useLoaderData } from "react-router-dom";
import { UserData } from "../../service/users-service";
import "../../css/User.css";

type Props = {};

const UserDetails = (props: Props) => {
  let user = useLoaderData() as UserData;
  return (
    <div className="restaurant-details-container">
      <div className="restaurant-header">
        <img src={user?.image} />
        <h2>
          {user?.firstName}
          {user?.lastName}
        </h2>
      </div>
      <div className="restaurant-info">
        <div className="detail-item">
          <span>Username:</span> {user?.username}
        </div>
        <div className="detail-item">
          <span>Gender:</span> {user?.gender}
        </div>
        <div className="detail-item">
          <span>Email:</span> {user?.email}
        </div>
        <div className="detail-item">
          <span>Role:</span> {user?.role}
        </div>
        {/* <div className="detail-item">
          <span className="detail-title">Register Date:</span>
          <span className="detail-value">{user?.registerDate}</span>
        </div>
        <div className="detail-item">
          <span className="detail-title">Latest Modification Date:</span>
          <span className="detail-value">{user?.latestModification}</span>
        </div> */}
      </div>

      <div className="restaurant-actions">
        <Form method="PUT">
          <button type="submit">Edit</button>
        </Form>
        <Form
          method="DELETE"
          onSubmit={(event) => {
            // eslint-disable-next-line no-restricted-globals
            if (!confirm("Please confirm you want to delete this record.")) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit">Delete</button>
        </Form>
      </div>
    </div>
  );
};

export default UserDetails;
