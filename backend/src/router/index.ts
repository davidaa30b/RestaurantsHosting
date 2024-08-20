import express from "express";
import authentication from "./authentication";
import users from "./users";
import managers from "./managers";
import admins from "./admins";
import staff from "./staff";
import inboxes from "./inboxes";
import restaurants from "./restaurants";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  managers(router);
  staff(router);
  restaurants(router);
  admins(router);
  inboxes(router);
  return router;
};
