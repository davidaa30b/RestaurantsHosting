import express from "express";

import { isAuthenticated, isManager } from "../middleware";

import {
  createNewRestaurant,
  approveJobApplication,
  addDishToRestaurant,
  getAllOrdersByRestraurantForManager,
  fireStaffMember,
  deleteDishFromRestaurant,
  updateDish,
} from "../controllers/manager";
export default (router: express.Router) => {
  router.post(
    "/restaurants/:restaurantId/add-dish-to-restautant",
    isAuthenticated,
    isManager(),
    addDishToRestaurant
  );
  router.delete(
    "/restaurants/:restaurantId/dishes/:dishId/delete-dish-from-restautant",
    isAuthenticated,
    isManager(),
    deleteDishFromRestaurant
  );
  router.put(
    "/restaurants/:restaurantId/dishes/:dishId",
    isAuthenticated,
    isManager(),
    updateDish
  );

  router.post(
    "/inboxes/:inboxId/approve-job-application/:approve",
    isAuthenticated,
    isManager(),
    approveJobApplication
  );
  router.post(
    "/create-new-restaurant",
    isAuthenticated,
    isManager(),
    createNewRestaurant
  );
  router.get(
    "/restaurants/:restaurantId/orders",
    isAuthenticated,
    getAllOrdersByRestraurantForManager
  );

  router.delete(
    "/restaurants/:restaurantId/staff-table/:staffId",
    isAuthenticated,
    isManager(),
    fireStaffMember
  );
};
