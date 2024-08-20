import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  DishData,
  DishesData,
  addRatingToDish,
  deleteDish,
} from "../../service/dishes-services";
import { useCart } from "../order/CartContext";
import { useEffect, useState } from "react";
import { calculateRating } from "../../help_functions/calculateRating";
import "../../css/Menu.css";
import { RatingErrors } from "../../service/restaurant-services";

const Menu = () => {
  const { dishes } = useLoaderData() as DishesData;
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [showRatingInputs, setShowRatingInputs] = useState<
    Record<string, boolean>
  >({});
  const [inputRatings, setInputRatings] = useState<Record<string, string>>({});
  const [errorRatings, setErrorRatings] = useState<RatingErrors>({});

  const [sortedDishes, setSortedDishes] = useState<DishData[]>([...dishes]);
  const [sortOption, setSortOption] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const currentUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    console.log("dishes", dishes);
  });

  const handleOrder = (dish: DishData) => {
    addToCart({
      id: dish._id,
      name: dish.name,
      price: dish.price,
      estimated_time: dish.estimated_time,
      quantity: 1,
    });
    navigate(`/restaurants/${restaurantId}/menu/cart`);
  };

  const handleAddRatingClick = (dishId: string) => {
    setShowRatingInputs((prevState) => ({
      ...prevState,
      [dishId]: true,
    }));
  };

  const handleRatingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dishId: string
  ) => {
    const rating = e.target.value;
    setInputRatings((prevState) => ({
      ...prevState,
      [dishId]: rating,
    }));
  };

  const rateDish = (e: React.FormEvent, dishId: string) => {
    e.preventDefault();
    const errors: RatingErrors = {} as RatingErrors;
    if (restaurantId) {
      if (!inputRatings[dishId]) {
        addRatingToDish(dishId, "1");
      } else {
        if (
          Number(inputRatings[dishId]) > 6 ||
          Number(inputRatings[dishId]) < 0
        ) {
          errors.rating = "Error. Rating is only between 0 to 6.";
          errors.id = dishId;
          setErrorRatings(errors);
        } else {
          addRatingToDish(dishId, inputRatings[dishId]);
          setErrorRatings({});
        }
      }
    }
    setShowRatingInputs((prevState) => ({
      ...prevState,
      [dishId]: false,
    }));
  };

  const handleSortChange = (selectedOption: string) => {
    setSortOption(selectedOption);

    let sortedArray = [...dishes];
    if (selectedOption === "price") {
      sortedArray.sort(
        (a, b) => (a.price - b.price) * (sortDirection === "asc" ? 1 : -1)
      );
    } else if (selectedOption === "name") {
      sortedArray.sort(
        (a, b) =>
          a.name.localeCompare(b.name) * (sortDirection === "asc" ? 1 : -1)
      );
    } else if (selectedOption === "rating") {
      sortedArray.sort(
        (a, b) =>
          (calculateRating(b.ratings) - calculateRating(a.ratings)) *
          (sortDirection === "asc" ? 1 : -1)
      );
    }
    setSortedDishes(sortedArray);
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDirection = e.target.value as "asc" | "desc";
    setSortDirection(selectedDirection);

    if (sortOption) {
      handleSortChange(sortOption);
    }
  };

  const handleEditClick = (dishId: string) => {
    navigate(`/restaurants/${restaurantId}/menu/${dishId}/edit`);
  };

  return (
    <div className="menu-container">
      <h3>Menu</h3>

      <div className="sorting-options">
        <div>
          <label>Sort by: </label>
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Select</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div>
          <label>Sort direction: </label>
          <select value={sortDirection} onChange={handleDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {dishes[0] ? (
        sortedDishes.map((d) => (
          <div key={d._id} className="dish-card">
            <div className="dish-image">
              <img src={d?.image} alt={d.name} />
            </div>
            <div className="dish-details">
              <div className="dish-name">Name: {d.name}</div>
              <div className="dish-characteristics">
                <strong>Description:</strong> {d.description}
              </div>
              <div className="dish-characteristics">
                <strong>Rating:</strong> {calculateRating(d.ratings)}
              </div>
              <div className="dish-characteristics">
                <strong>Price:</strong> ${d.price}
              </div>
              <div className="dish-characteristics">
                <strong>Estimated Time:</strong> {d.estimated_time} mins
              </div>
              <button onClick={() => handleOrder(d)}>Order</button>
              <button
                onClick={() => handleAddRatingClick(d._id)}
                hidden={showRatingInputs[d._id]}
              >
                Add rating
              </button>

              {currentUserRole === "manager" && (
                <button
                  id="delete-button"
                  onClick={() => {
                    deleteDish(d._id, d.restaurant_id);
                    window.location.reload();
                  }}
                >
                  Delete
                </button>
              )}
              {showRatingInputs[d._id] && (
                <div className="rating-input">
                  <input
                    value={inputRatings[d._id] || "1"}
                    onChange={(e) => handleRatingChange(e, d._id)}
                  />
                  <button type="button" onClick={(e) => rateDish(e, d._id)}>
                    Rate
                  </button>
                </div>
              )}

              {currentUserRole === "manager" && (
                <button
                  type="button"
                  onClick={() => handleEditClick(d._id)}
                  style={{ backgroundColor: "orange", marginLeft: "10px" }}
                >
                  Edit
                </button>
              )}
            </div>
            {errorRatings.rating && errorRatings.id === d._id && (
              <div className="error-message">{errorRatings.rating}</div>
            )}
          </div>
        ))
      ) : (
        <div className="dish-card">No dishes are present</div>
      )}
      <Outlet />
    </div>
  );
};

export default Menu;
