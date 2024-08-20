import express from "express";

import {
  deleteUser,
  getAllUsers,
  updateUser,
  applyForManager,
  applyForJob,
  createNewOrder,
  getCurrentUser,
  showMenuForRestaurant,
  rateRestaurant,
  rateDish,
  getAllDishes,
} from "../controllers/users";

import { isAuthenticated, isOwner, isUser, isAdmin } from "../middleware";

export default (router: express.Router) => {
  router.get("/users", getAllUsers);
  router.get("/dishes", getAllDishes);
  router.get("/current-user", isAuthenticated, getCurrentUser);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.put("/users/:id", isAuthenticated, isOwner, updateUser);
  router.post("/apply-for-manager", isAuthenticated, isUser(), applyForManager);
  router.post(
    "/restaurants/:restaurant_id/apply-for-job",
    isAuthenticated,
    // isUser(),
    applyForJob
  );
  router.post(
    "/restaurants/:restaurant_id/create-new-order",
    isAuthenticated,
    isUser(),
    createNewOrder
  );
  router.get("/restaurants/:restaurant_id/menu", showMenuForRestaurant);

  router.post(
    "/restaurants/:restaurant_id/rate-restaurant",
    isAuthenticated,
    rateRestaurant
  );
  router.post("/dishes/:dish_id/rate-dish", isAuthenticated, rateDish);
};
