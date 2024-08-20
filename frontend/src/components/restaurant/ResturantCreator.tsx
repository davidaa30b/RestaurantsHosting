import { useState } from "react";
import { RestaurantData } from "../../service/restaurant-services";
import { useNavigate } from "react-router-dom";
import "../../css/Restaurant.css"; // Import the CSS

const ResturantCreator = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let inputRestaurant: RestaurantData = {} as RestaurantData;
    inputRestaurant.name = name;
    inputRestaurant.address = address;
    inputRestaurant.description = description;

    if (image === "") {
      inputRestaurant.image =
        "https://raw.githubusercontent.com/davidaa30b/RestaurantsHosting/master/images/unknown.png";
    } else {
      inputRestaurant.image = image;
    }

    fetch("http://localhost:8080/create-new-restaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(inputRestaurant),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add restaurant");
        }
        return response.json();
      })
      .then((newUser) => {
        console.log("New restaurant added:", newUser);
      })
      .catch((error) => {
        console.error("Error adding restaurant:", error);
      });

    alert("You have created a new restaurant successfully!");
    navigate("/restaurants");
  }

  return (
    <div className="restaurant-creator-container">
      <h2>Create New Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name (required):
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Address (required):
            <input
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description (required):
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Image URL:
            <input type="url" onChange={(e) => setImage(e.target.value)} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ResturantCreator;
