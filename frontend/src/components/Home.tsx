import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useLoaderData } from "react-router-dom";
import { RestaurantsData } from "../service/restaurant-services";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import { calculateRating } from "../help_functions/calculateRating";
import { DishData, getDishes } from "../service/dishes-services";
function Home() {
  const { restaurants } = useLoaderData() as RestaurantsData;
  const [dishes, setDishes] = useState<DishData[]>([]);
  // Sort restaurants by rating in descending order and get the top 5
  const topRestaurants = restaurants
    .sort((a, b) => calculateRating(b.ratings) - calculateRating(a.ratings))
    .slice(0, 5);
  useEffect(() => {
    async function fetchDishes() {
      const dishes = await getDishes();
      if (dishes) {
        setDishes(
          dishes.dishes
            .sort(
              (a, b) => calculateRating(b.ratings) - calculateRating(a.ratings)
            )
            .slice(0, 5)
        );
      }
    }
    fetchDishes();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      {topRestaurants.length !== 0 ? (
        <h2>Look at the current top {topRestaurants.length} restaurants</h2>
      ) : (
        <h2>No restaurants present</h2>
      )}

      {/* Wrapper to center the carousel */}
      <div className="carousel-wrapper">
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={3000}
        >
          {topRestaurants.map((restaurant) => (
            <div key={restaurant._id}>
              <img src={restaurant.image} alt={restaurant.name} />
              <div className="legend">
                <h3>{restaurant.name}</h3>
                <p>Rating: {calculateRating(restaurant.ratings)}</p>
                <p>Description: {restaurant.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {dishes.length !== 0 ? (
        <h2>Look at the current top {dishes.length} restaurants</h2>
      ) : (
        <h2>No dishes present</h2>
      )}
      <div className="carousel-wrapper">
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={3000}
        >
          {dishes.map((dish) => (
            <div key={dish._id}>
              <img src={dish.image} alt={dish.name} />
              <div className="legend">
                <h3>{dish.name}</h3>
                <p>Rating: {calculateRating(dish.ratings)}</p>
                <p>Description: {dish.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
