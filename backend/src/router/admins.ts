import express from "express";
import { approveManagerApplication } from "../controllers/admin";
import { isAuthenticated, isAdmin } from "../middleware";

export default (router: express.Router) => {
  router.post(
    "/inboxes/:inboxId/approve-manager-application",
    isAuthenticated,
    isAdmin(),
    approveManagerApplication
  );
};
