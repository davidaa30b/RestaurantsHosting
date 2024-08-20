import { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import {
  UserData,
  getCurrentUser,
  getUserById,
} from "../../service/users-service";
import { getRstaurantById } from "../../service/restaurant-services";
import "../../css/Mailing.css";

type Props = {};

const JobApplicationForRestaurant = (props: Props) => {
  const { restaurantId } = useParams();
  const [currentUser, setCurrentUser] = useState<UserData>();
  const [manager, setManager] = useState<UserData>();

  useEffect(() => {
    const getUsers = async () => {
      const user = await getCurrentUser();
      if (restaurantId) {
        const restautant = await getRstaurantById(restaurantId);
        if (restautant) {
          const manager = await getUserById(restautant.manager_id);
          setManager(manager);
        }
      }

      setCurrentUser(user);
    };

    getUsers();
  }, []);
  return (
    <div className="apply-for-manager-container">
      <Form method="POST" className="contact-form">
        <div className="form-row">
          <div>
            {" "}
            <label>
              From: <input value={currentUser?.email} disabled={true} />
            </label>
          </div>
          <div>
            <label>
              Name :{" "}
              <input
                value={`${currentUser?.firstName} ${currentUser?.lastName}`}
                disabled={true}
              />
            </label>
          </div>
        </div>
        <div className="form-row">
          <div>
            {" "}
            <label>
              To: <input value={manager?.email} disabled={true} />
            </label>
          </div>
          <div>
            {" "}
            <label>
              Name :{" "}
              <input
                value={`${manager?.firstName} ${manager?.lastName}`}
                disabled={true}
              />
            </label>
          </div>
        </div>
        <label>
          Message
          <textarea name="message" />
        </label>
        <select name="position">
          <option value="cook" selected>
            Cooker
          </option>
          <option value="delivery">Delivery Guy</option>
        </select>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default JobApplicationForRestaurant;
