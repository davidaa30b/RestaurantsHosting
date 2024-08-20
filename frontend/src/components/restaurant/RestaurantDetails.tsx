import { Form, useLoaderData, useNavigate } from "react-router-dom";
import "../../css/Restaurant.css";
import { useEffect, useState } from "react";
import { getCurrentUser, getUserById } from "../../service/users-service";
import {
  RatingErrors,
  RestaurantData,
  addRatingToRestaurant,
} from "../../service/restaurant-services";
import { getStaffMemberByEmail } from "../../service/staff-services";
import { calculateRating } from "../../help_functions/calculateRating";
type Props = {};

const RestaurantDetails = (props: Props) => {
  let restaurant = useLoaderData() as RestaurantData;
  const navigate = useNavigate();

  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  const [canApplyJob, setCanApplyJob] = useState(false);
  const [errorRatings, setErrorRatings] = useState<RatingErrors>({});

  const [showRatingInput, setShowRatingInput] = useState(false);
  const [inputRating, setInputRating] = useState("1");

  const currentUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchUserNames = async () => {
      const namesMap: Record<string, string> = {};

      if (!namesMap[restaurant.manager_id]) {
        const manager = await getUserById(restaurant.manager_id);
        if (manager) {
          namesMap[
            restaurant.manager_id
          ] = `${manager.firstName} ${manager.lastName}`;
        }
      }

      const user = await getCurrentUser();
      if (user) {
        const staff = await getStaffMemberByEmail(user.email);
        if (staff) {
          setCanApplyJob(true);
        } else {
          setCanApplyJob(false);
        }
      }

      setManagerNames(namesMap);
    };
    fetchUserNames();
  }, [restaurant]);

  function rateRestaurant(e: React.FormEvent) {
    const errors: RatingErrors = {} as RatingErrors;

    if (Number(inputRating) > 6 || Number(inputRating) < 0) {
      errors.rating = "Error. Rating is only between 0 to 6.";
      errors.id = restaurant._id;
      setErrorRatings(errors);
    } else {
      setErrorRatings({});
      addRatingToRestaurant(restaurant._id, inputRating);
    }
    setShowRatingInput(false);
  }

  return (
    <div className="restaurant-details-container">
      <div className="restaurant-header">
        <img src={restaurant?.image} />
        <h2>
          Name:
          {restaurant?.name}
        </h2>
      </div>
      <div className="restaurant-info">
        <div className="detail-item">
          <span>Manager:</span> {managerNames[restaurant.manager_id]}
        </div>

        <div className="detail-item">
          <span>Address:</span> {restaurant?.address}
        </div>
        <div className="detail-item">
          <span>Description:</span> {restaurant?.description}
        </div>
        <div className="detail-item">
          <span>Rating:</span> {calculateRating(restaurant?.ratings)}
        </div>
        <div className="detail-item">
          <span>Available Cook positions:</span>{" "}
          {restaurant?.availableCookPositions}
        </div>
        <div className="detail-item">
          <span>Available Delivery Guys positions:</span>{" "}
          {restaurant?.availableDeliveryPositions}
        </div>
      </div>

      <div className="restaurant-actions">
        {currentUserRole === "manager" && (
          <Form method="PUT">
            <button type="submit">Edit</button>
          </Form>
        )}
        {currentUserRole === "manager" && (
          <button
            type="submit"
            onClick={() =>
              navigate(`/restaurants/${restaurant._id}/add-dish-to-restautant`)
            }
          >
            Add Dish
          </button>
        )}
        {currentUserRole === "manager" && (
          <button
            type="submit"
            onClick={() =>
              navigate(`/restaurants/${restaurant._id}/staff-table`)
            }
          >
            Check staff
          </button>
        )}
        <button
          onClick={(event) => navigate(`/restaurants/${restaurant._id}/menu`)}
        >
          Show Menu
        </button>
        {currentUserRole !== "manager" && (
          <button
            disabled={canApplyJob}
            onClick={(event) =>
              navigate(`/restaurants/${restaurant._id}/apply-for-job`)
            }
          >
            Apply for job
          </button>
        )}
        {currentUserRole === "user" && (
          <button
            onClick={() => setShowRatingInput(true)}
            hidden={showRatingInput}
          >
            Add rating
          </button>
        )}
        {showRatingInput && (
          <input
            value={inputRating}
            onChange={(e) => setInputRating(e.target.value)}
          />
        )}
        {showRatingInput && (
          <button type="button" onClick={rateRestaurant}>
            Rate
          </button>
        )}
        {currentUserRole === "manager" && (
          <Form
            method="DELETE"
            onSubmit={(event) => {
              // eslint-disable-next-line no-restricted-globals
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button id="delete-button" type="submit">
              Delete
            </button>
          </Form>
        )}
      </div>
      {errorRatings.rating && errorRatings.id === restaurant._id && (
        <div className="error-message">{errorRatings.rating}</div>
      )}
    </div>
  );
};

export default RestaurantDetails;
