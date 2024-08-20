import express from "express";
import { get } from "lodash";

import {
  deleteUserById,
  getUsers,
  getUserById,
  getAdmins,
  updateUserById,
} from "../db/users";
import { createApplyForManagerInboxes, createInbox } from "../db/inboxes";
import {
  getRestaurantById,
  getRestaurants,
  updateRestaurantById,
} from "../db/restaurants";
import { createOrder } from "../db/orders";
import { getDishById, getDishes, updateDishById } from "../db/dishes";

export const showMenuForRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  const { restaurant_id } = req.params;
  try {
    const currentRestaurant = await getRestaurantById(restaurant_id);
    const dishesIds = currentRestaurant.dishes_ids;
    const menu = await Promise.all(
      dishesIds.map(async (dishId) => {
        console.log("dishId", dishId);
        console.log("dishId", dishId.toString());
        const dish = await getDishById(dishId.toString());
        console.log("dish", dish);
        return dish;
      })
    );

    console.log("menu", menu);
    return res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to get menu for restaurant." });
  }
};
export const rateRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  const { restaurant_id } = req.params;
  const { rating } = req.body;
  console.log("rating", rating);
  const ratingNumber = Number(rating);

  try {
    const currentRestaurant = await getRestaurantById(restaurant_id);
    currentRestaurant.ratings.push(ratingNumber);
    console.log("currentRestaurant", currentRestaurant);

    const updatedRestaurant = await updateRestaurantById(
      restaurant_id,
      currentRestaurant
    );
    console.log("updatedRestaurant", updatedRestaurant);

    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to get menu for restaurant." });
  }
};
export const rateDish = async (req: express.Request, res: express.Response) => {
  const { dish_id } = req.params;
  const { rating } = req.body;
  console.log("rating hererere", rating);
  const ratingNumber = Number(rating);

  try {
    const currentDish = await getDishById(dish_id);
    currentDish.ratings.push(ratingNumber);
    console.log("currentDish", currentDish);

    const updatedDish = await updateDishById(dish_id, currentDish);

    console.log("updatedDish", updatedDish);

    return res.status(200).json(updatedDish);
  } catch (error) {
    res.status(500).json({ error: "Failed to get menu for restaurant." });
  }
};

export const getCurrentUser = async (
  req: express.Request,
  res: express.Response
) => {
  const currentUserId = get(req, "identity._id") as string;

  if (!currentUserId) {
    return res.sendStatus(403);
  }

  try {
    const currentUser = await getUserById(currentUserId.toString());
    return res.status(200).json(currentUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to get current user." });
  }
};

export const applyForManager = async (
  req: express.Request,
  res: express.Response
) => {
  const currentUserId = get(req, "identity._id") as string;

  if (!currentUserId) {
    return res.sendStatus(403);
  }

  //const currentUser = await getUserById(currentUserId.toString());

  const { message } = req.body;

  try {
    const admins = await getAdmins();

    // Create an inbox entry for each admin
    createApplyForManagerInboxes(admins, currentUserId.toString(), message);

    res
      .status(200)
      .json({ message: "Application submitted successfully to all admins." });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit application." });
  }
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const getAllDishes = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const dishes = await getDishes();

    return res.status(200).json(dishes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedUser = await updateUserById(id, update);

    return res.status(200).json(updatedUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllRestaurants = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const restaurants = await getRestaurants();

    return res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const applyForJob = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("hereeeeeeeeeeeeeeeeeeeeeeeee N");
    const { restaurant_id } = req.params;

    const { position, message } = req.body;
    if (!["cook", "delivery"].includes(position)) {
      return res.status(400).json({ error: "Invalid position" });
    }
    const currentUserId = get(req, "identity._id") as string;

    const restaurant = await getRestaurantById(restaurant_id);

    if (!restaurant) {
      console.log("No resturant exisiting");
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const managerId = restaurant.manager_id;

    const managerInboxEntry = await createInbox({
      sender_id: currentUserId,
      sender_type: "User",
      recipient_id: managerId,
      recipient_type: "User",
      message: message,
      type: "jobApplication",
      position,
      restaurant_id,
    });

    res.status(201).json({
      message: "Job application submitted successfully.",
      managerInboxEntry,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const createNewOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { restaurant_id } = req.params;

    const order = req.body;
    const user_id = get(req, "identity._id") as string;

    console.log(order);

    let status = "pending";

    const newOrder = await createOrder({
      user_id,
      restaurant_id,
      dish_quantities: order.dish_quantities,
      total_price: order.total_price,
      estimated_time: order.estimated_time,
      status,
    });

    const io = req.app.get("socketio");
    io.emit("order_created", newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};
