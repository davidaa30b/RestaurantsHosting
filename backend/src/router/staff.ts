import express from "express";

import {
  markOrderAsCooked,
  markOrderAsDelivered,
  getAllStaff,
  markOrderAsDelivering,
  markOrderAsCooking,
  getAllOrdersByRestraurant,
  getAllOrdersByUser,
  staffResign,
} from "../controllers/staff";
import { isAuthenticated, isAuthenticatedStaff } from "../middleware";

export default (router: express.Router) => {
  router.patch(
    "/staff/orders/:order_id/mark-as-cooking",
    isAuthenticatedStaff,
    markOrderAsCooking
  );
  router.patch(
    "/staff/orders/:order_id/mark-as-cooked",
    isAuthenticatedStaff,
    markOrderAsCooked
  );
  router.patch(
    "/staff/orders/:order_id/mark-as-delivering",
    isAuthenticatedStaff,
    markOrderAsDelivering
  );
  router.patch(
    "/staff/orders/:order_id/mark-as-delivered",
    isAuthenticatedStaff,
    markOrderAsDelivered
  );

  router.get("/staff", getAllStaff);
  router.get("/staff/orders", isAuthenticatedStaff, getAllOrdersByRestraurant);
  router.get("/user/orders", isAuthenticated, getAllOrdersByUser);

  router.delete("/staff/resign", isAuthenticatedStaff, staffResign);
};
