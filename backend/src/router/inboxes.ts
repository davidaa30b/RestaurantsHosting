import express from "express";

import { getAllInboxes, deleteInbox } from "../controllers/inboxes";

import { isAuthenticated } from "../middleware";
export default (router: express.Router) => {
  router.get("/inboxes", isAuthenticated, getAllInboxes);
  router.delete("/inboxes/:id", isAuthenticated, deleteInbox);
};
