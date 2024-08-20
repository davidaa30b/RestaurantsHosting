import express from "express";
import {
  createRestaurant,
  updateRestaurantById,
  deleteRestaurantById,
  getRestaurantById,
} from "../db/restaurants";

import { getUserByEmail, getUserById } from "../db/users";

import { createStaff, deleteStaffById, getStaffById } from "../db/staff";

import { createInbox, getInboxById } from "../db/inboxes";

import { createDish, deleteDishById, updateDishById } from "../db/dishes";

import { get } from "lodash";
import { random, authentication } from "../helpers";
import { getOrders } from "../db/orders";

export const createNewRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      name,
      staff_ids = [],
      dish_quantities = [],
      address,
      description,
      image,
      ratings = [],
      availableCookPositions = 50,
      availableDeliveryPositions = 50,
    } = req.body;

    const currentUserId = get(req, "identity._id") as string;

    const newRestaurant = await createRestaurant({
      name,
      manager_id: currentUserId.toString(),
      staff_ids,
      dish_quantities,
      address,
      description,
      image,
      ratings,
      availableCookPositions,
      availableDeliveryPositions,
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Error creating restaurant" });
  }
};

export const updateRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { restaurantId } = req.params;

    // const { name, address, description } = req.body;
    const update = req.body;

    const updatedRestaurant = await updateRestaurantById(restaurantId, update);

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.log("Error updating restaurant:", error);
    res.status(500).json({ error: "Error updating restaurant" });
  }
};
export const updateDish = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { dishId } = req.params;

    // const { name, address, description } = req.body;
    const update = req.body;

    const updatedDish = await updateDishById(dishId, update);

    res.status(200).json(updatedDish);
  } catch (error) {
    console.log("Error updating restaurant:", error);
    res.status(500).json({ error: "Error updating restaurant" });
  }
};

export const deleteRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { restaurantId } = req.params;
    const deletedRestaurant = await deleteRestaurantById(restaurantId);
    const dishes_ids = deletedRestaurant.dishes_ids;
    dishes_ids.forEach(async (d) => {
      await deleteDishById(d._id.toString());
    });
    return res.json(deletedRestaurant);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const approveJobApplication = async (
  req: express.Request,
  res: express.Response
) => {
  const { inboxId, approve } = req.params;
  console.log(`inboxId ${inboxId}, approve ${approve}`);
  let message = "";

  try {
    const inboxEntry = await getInboxById(inboxId);

    if (!inboxEntry) {
      return res.status(404).json({ error: "Message not found" });
    }
    const candidateIndex = inboxEntry.sender_id.toString();
    const candidate = await getUserById(candidateIndex);
    message = `Hello ${candidate.firstName} ${candidate.lastName}`;
    const restaurant = await getRestaurantById(
      inboxEntry.restaurant_id.toString()
    );
    const manager = await getUserById(inboxEntry.recipient_id.toString());
    const approveBoolean = approve === "true" ? true : false;

    if (
      approveBoolean &&
      restaurant.availableCookPositions > 0 &&
      restaurant.availableDeliveryPositions > 0
    ) {
      if (inboxEntry.position === "cook") {
        restaurant.availableCookPositions -= 1;
      } else if (inboxEntry.position === "delivery") {
        restaurant.availableDeliveryPositions -= 1;
      }

      const salt = random();
      const specialToken = authentication(salt, candidateIndex);

      const newStaffMember = await createStaff({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        status: "free",
        role: inboxEntry.position,
        authentication: {
          loginToken: specialToken,
          sessionToken: "",
        },
        restaurant_id: inboxEntry.restaurant_id.toString(),
      });

      restaurant.staff_ids.push(newStaffMember._id);

      await updateRestaurantById(
        inboxEntry.restaurant_id.toString(),
        restaurant
      );

      message += `\n.We are happy to inform that you have been accepted to be a ${inboxEntry.position}
      in ${restaurant.name} restaurant. 
      Your entry token to your new staff account is \n[ ${specialToken} ]\n
      Congratulations on the new job! We expect you to join us soon!\n`;
    } else if (
      restaurant.availableCookPositions <= 0 ||
      restaurant.availableDeliveryPositions <= 0
    ) {
      message += `\nWe are sorry to inform that you have been rejected to be a ${inboxEntry.position}
      in ${restaurant.name} restaurant due to lack of employee positions for ${inboxEntry.position}.
      You can try again later in the future.\n`;
    } else if (!approveBoolean) {
      message += `\nWe are sorry to inform that you have been rejected to be a ${inboxEntry.position}
      in ${restaurant.name} restaurant. The messaged lacked qualities, motivation and reason to
      take the job. These are things we look deep in our emplooyes. You can try again later in the 
      future.\n`;
    }

    message += `Kind regards,
    ${manager.firstName} ${manager.lastName}
    manager of ${restaurant.name}`;

    await createInbox({
      sender_id: inboxEntry.recipient_id,
      sender_type: "Manager",
      recipient_id: inboxEntry.sender_id,
      recipient_type: "User",
      message: message,
      type: "jobApplication",
      position: inboxEntry.position,
      restaurant_id: inboxEntry.restaurant_id,
    });

    console.log("message", message);

    res.status(200).json({
      output: `Application ${
        approveBoolean ? "approved" : "rejected"
      } successfully.`,
      message: message,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    res.status(500).json({ error: "Failed to process application." });
  }
};

export const addDishToRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  const { restaurantId } = req.params;

  const dish = req.body;
  console.log(dish);
  try {
    const restaurant = await getRestaurantById(restaurantId);

    const newDish = await createDish({
      restaurant_id: restaurantId,
      name: dish.name,
      image: dish.image,
      description: dish.description,
      ratings: [],
      price: dish.price,
      estimated_time: dish.estimated_time,
    });
    restaurant.dishes_ids.push(newDish._id);
    await updateRestaurantById(restaurantId, restaurant);

    res.status(200).json({
      restaurant,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    res.status(500).json({ error: "Failed to process application." });
  }
};

export const deleteDishFromRestaurant = async (
  req: express.Request,
  res: express.Response
) => {
  const { dishId, restaurantId } = req.params;

  try {
    const deletedDish = await deleteDishById(dishId);
    const restaurant = await getRestaurantById(restaurantId);
    const dishes_ids = restaurant.dishes_ids.filter(
      (d) => d._id.toString() !== dishId.toString()
    );

    await updateRestaurantById(restaurantId, { dishes_ids: dishes_ids });

    res.status(200).json({
      deletedDish,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    res.status(500).json({ error: "Failed to process application." });
  }
};

export const getAllOrdersByRestraurantForManager = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { restaurantId } = req.params;
    const orders = await getOrders();

    return res
      .status(200)
      .json(
        orders.filter(
          (o) => o.restaurant_id.toString() === restaurantId.toString()
        )
      );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const fireStaffMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity._id") as string;
    const manager = await getUserById(currentUserId.toString());

    const { staffId } = req.params;
    const deletedStaffMember = await deleteStaffById(staffId);

    const user = await getUserByEmail(deletedStaffMember.email);
    const message = `Hello ${user.firstName} ${user.lastName},\n Unfortunatelly you 
    had to be relieved. Good luck in the future!\nKind regards\n 
    ${manager.firstName} ${manager.lastName}`;

    await createInbox({
      sender_id: currentUserId,
      sender_type: "Manager",
      recipient_id: user._id,
      recipient_type: "User",
      message: message,
      type: "jobApplication",
      position: deletedStaffMember.role,
      restaurant_id: deletedStaffMember.restaurant_id,
    });

    const restaurant = await getRestaurantById(
      deletedStaffMember.restaurant_id.toString()
    );

    if (deletedStaffMember.role === "cook") {
      const newCookPositions = restaurant.availableCookPositions + 1;
      await updateRestaurantById(restaurant._id.toString(), {
        availableCookPositions: newCookPositions,
      });
    } else if (deletedStaffMember.role === "delivery") {
      const newDeliveryPositions = restaurant.availableDeliveryPositions + 1;
      await updateRestaurantById(restaurant._id.toString(), {
        availableDeliveryPositions: newDeliveryPositions,
      });
    }

    return res.json(deletedStaffMember);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
