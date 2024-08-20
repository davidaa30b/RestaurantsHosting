import express from "express";
import { getOrders, updateOrderById } from "../db/orders";
import {
  getStaff,
  updateStaffById,
  getStaffById,
  deleteStaffById,
} from "../db/staff";
import { get } from "lodash";

export const getAllOrdersByRestraurant = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const orders = await getOrders();
    const staff_id = get(req, "identityStaff._id") as string;

    const staff = await getStaffById(staff_id);
    const restaurant_id = staff.restaurant_id;
    return res
      .status(200)
      .json(
        orders.filter(
          (o) => o.restaurant_id.toString() === restaurant_id.toString()
        )
      );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllOrdersByUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const orders = await getOrders();
    const user_id = get(req, "identity._id") as string;

    console.log(
      "user orders",
      orders.filter((o) => o.user_id.toString() === user_id.toString())
    );
    return res
      .status(200)
      .json(orders.filter((o) => o.user_id.toString() === user_id.toString()));
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllStaff = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allStaff = await getStaff();

    return res.status(200).json(allStaff);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const markOrderAsCooking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("We lookin for oopss");
    const staff_id = get(req, "identityStaff._id") as string;
    await updateStaffById(staff_id, { status: "busy" });
    const { order_id } = req.params;
    const updatedOrder = await updateOrderById(order_id, {
      status: "cooking",
      cook_id: staff_id.toString(),
      cooking_start_time: Date.now(),
    });
    const io = req.app.get("socketio");
    io.emit("order_cooking", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error marking order as cooking:", error);
    res.status(500).json({ error: "Error marking order as cooking" });
  }
};

export const markOrderAsCooked = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const staff_id = get(req, "identityStaff._id") as string;
    await updateStaffById(staff_id, { status: "free" });
    const { order_id } = req.params;
    const updatedOrder = await updateOrderById(order_id, {
      status: "cooked",
      cooking_end_time: Date.now(),
    });
    const io = req.app.get("socketio");
    io.emit("order_cooked", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error marking order as cooked:", error);
    res.status(500).json({ error: "Error marking order as cooked" });
  }
};

export const markOrderAsDelivering = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const staff_id = get(req, "identityStaff._id") as string;
    await updateStaffById(staff_id, { status: "busy" });
    const { order_id } = req.params;
    const updatedOrder = await updateOrderById(order_id, {
      status: "delivering",
      delivery_id: staff_id.toString(),
      delivery_start_time: Date.now(),
    });
    const io = req.app.get("socketio");
    io.emit("order_delivering", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error marking order as delivering:", error);
    res.status(500).json({ error: "Error marking order as delivering" });
  }
};
export const markOrderAsDelivered = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const staff_id = get(req, "identityStaff._id") as string;
    await updateStaffById(staff_id, { status: "free" });
    const { order_id } = req.params;
    const updatedOrder = await updateOrderById(order_id, {
      status: "delivered",
      delivery_end_time: Date.now(),
    });
    const io = req.app.get("socketio");
    io.emit("order_delivered", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ error: "Error marking order as delivered" });
  }
};

export const staffResign = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const staff_id = get(req, "identityStaff._id") as string;

    const deletedStaffMember = await deleteStaffById(staff_id);

    res.status(200).json(deletedStaffMember);
  } catch (error) {
    console.error("Error deleting staff memeber:", error);
    res.status(500).json({ error: "Error deleting staff memeber" });
  }
};
