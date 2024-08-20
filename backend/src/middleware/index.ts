import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken, getUserById } from "../db/users";
import { getStaffBySessionToken } from "../db/staff";
import { getRestaurantById } from "../db/restaurants";

export const isUser = () => isRole("user");

export const isManager = () => isRole("manager");

export const isAdmin = () => isRole("admin");

const isRole =
  (role: string) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const currentUserId = get(req, "identity._id") as string;

      if (!currentUserId) {
        console.log("IsManager here problem currentUserId");
        return res.sendStatus(403);
      }

      const user = await getUserById(currentUserId.toString());

      if (user.role !== role) {
        console.log("IsManager here problem role");

        return res.sendStatus(403);
      }

      next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };

export const isOwnerRestaurant = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    const restaurant = await getRestaurantById(restaurantId);

    if (currentUserId.toString() != restaurant.manager_id.toString()) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() != id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["DAVID-AUTH"];

    if (!sessionToken) {
      console.log(sessionToken);

      console.log("isAuthenticated here problem sessionToken");
      return res.sendStatus(403);
    }

    const exisitingUser = await getUserBySessionToken(sessionToken);

    if (!exisitingUser) {
      console.log("isAuthenticated here problem exisitingUser");

      return res.sendStatus(403);
    }

    merge(req, { identity: exisitingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

export const isAuthenticatedStaff = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["DAVID-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const exisitingStaff = await getStaffBySessionToken(sessionToken);

    if (!exisitingStaff) {
      return res.sendStatus(403);
    }

    merge(req, { identityStaff: exisitingStaff });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};
