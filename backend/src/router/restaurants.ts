import express from "express";

import { deleteRestaurant, updateRestaurant } from "../controllers/manager";
import { getAllRestaurants } from "../controllers/users";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/restaurants", getAllRestaurants);
  router.put("/restaurants/:restaurantId", isAuthenticated, updateRestaurant);
  router.delete(
    "/restaurants/:restaurantId",
    isAuthenticated,
    deleteRestaurant
  );
};
