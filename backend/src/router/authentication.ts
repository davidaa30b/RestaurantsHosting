import express from "express";

import {
  register,
  login,
  loginStaff,
  logout,
  logoutStaff,
} from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/logout", logout);
  router.post("/auth/login-staff", loginStaff);
  router.post("/auth/logout-staff", logoutStaff);
};
