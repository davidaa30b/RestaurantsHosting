import express from "express";
import {
  getUserByEmail,
  createUser,
  getUserBySessionToken,
  updateUserById,
} from "../db/users";
import { getStaffBySessionToken } from "../db/staff";
import { random, authentication } from "../helpers";

import { getStaffByLoginToken, updateStaffById } from "../db/staff";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+ role + authentication.salt + authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    console.log("login user updated", user);

    res.cookie("DAVID-AUTH", user.authentication.sessionToken, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
      domain: "localhost",
      path: "/",
    });
    console.log("Set-Cookie: DAVID-AUTH", user.authentication.sessionToken);

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const sessionToken = req.cookies["DAVID-AUTH"];
    console.log(sessionToken);

    if (!sessionToken) {
      console.log("sessionToken error");
      return res.sendStatus(402);
    }

    const existingUser = await getUserBySessionToken(sessionToken).select(
      "+ authentication.salt + authentication.password"
    );

    console.log("logout existingUser", existingUser);

    if (!existingUser) {
      console.log("existingUser error");

      return res.sendStatus(401);
    }

    // Clear the session token
    existingUser.authentication.sessionToken = "";
    await updateUserById(existingUser._id.toString(), {
      authentication: existingUser.authentication,
    });

    // Clear the cookie
    res.clearCookie("DAVID-AUTH", { domain: "localhost", path: "/" });

    return res.status(200).json(existingUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      role,
      password,
      gender,
      image,
    } = req.body;

    if (!username || !email || !role || !password) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user: any = await createUser({
      firstName,
      lastName,
      username,
      email,
      role,
      gender,
      image,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const loginStaff = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token } = req.body;
    console.log("token", token);
    if (!token) {
      return res.sendStatus(400);
    }

    const staff = await getStaffByLoginToken(token).select(
      "+ role + authentication.loginToken + authentication.sessionToken"
    );
    console.log("staff", staff);

    if (!staff) {
      return res.sendStatus(400);
    }

    const salt = random();
    staff.authentication.sessionToken = authentication(salt, token);
    await staff.save();
    console.log("staff updated", staff);

    res.cookie("DAVID-AUTH", staff.authentication.sessionToken, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
      domain: "localhost",
      path: "/",
    });
    console.log("Set-Cookie: DAVID-AUTH", staff.authentication.sessionToken);

    return res.status(200).json(staff).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logoutStaff = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const sessionToken = req.cookies["DAVID-AUTH"];
    console.log(sessionToken);

    if (!sessionToken) {
      return res.sendStatus(402);
    }

    const existingStaff = await getStaffBySessionToken(sessionToken).select(
      "+ authentication.loginToken"
    );

    if (!existingStaff) {
      console.log("existingStaff error");

      return res.sendStatus(401);
    }

    existingStaff.authentication.sessionToken = "";
    await updateStaffById(existingStaff._id.toString(), {
      authentication: existingStaff.authentication,
    });
    console.log("updated existingStaff", existingStaff);

    res.clearCookie("DAVID-AUTH", { domain: "localhost", path: "/" });

    return res.status(200).json(existingStaff).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
