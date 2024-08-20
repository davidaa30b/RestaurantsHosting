import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { RestaurantsData } from "../../service/restaurant-services";
import "../../css/Restaurant.css";
import { calculateRating } from "../../help_functions/calculateRating";

const Restaurants = () => {
  const { restaurants } = useLoaderData() as RestaurantsData;
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("userRole");

  // State for filtering
  const [filterName, setFilterName] = useState("");
  const [filterRating, setFilterRating] = useState("");

  // Filter restaurants based on name and rating
  const filteredRestaurants = restaurants.filter((r) => {
    const rating = calculateRating(r.ratings);
    const matchesName = r.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesRating =
      filterRating === "" || rating >= parseFloat(filterRating);
    return matchesName && matchesRating;
  });

  return (
    <div className="restaurant-list-container">
      <h1>Restaurants</h1>

      {/* Input fields for filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by minimum rating"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        />
      </div>

      {currentUserRole === "manager" &&
        (filteredRestaurants.filter((r) => r.manager_id === currentUserId)
          .length > 0 ? (
          filteredRestaurants
            .filter((r) => r.manager_id === currentUserId)
            .map((r) => (
              <div
                key={r._id}
                className="restaurant-item"
                onClick={() => navigate("/restaurants/" + r._id)}
              >
                <strong>Name:</strong> {r.name}
                <p>
                  <strong>Address:</strong> {r.address}
                </p>
                <p>
                  <strong>Rating:</strong> {calculateRating(r.ratings)}
                </p>
              </div>
            ))
        ) : (
          <div>No restaurants created</div>
        ))}

      {currentUserRole !== "manager" &&
        (filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((r) => (
            <div
              key={r._id}
              className="restaurant-item"
              onClick={() => navigate("/restaurants/" + r._id)}
            >
              <strong>Name:</strong> {r.name}
              <p>
                <strong>Address:</strong> {r.address}
              </p>
              <p>
                <strong>Rating:</strong> {calculateRating(r.ratings)}
              </p>
            </div>
          ))
        ) : (
          <div>No restaurants present</div>
        ))}

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

export default Restaurants;
