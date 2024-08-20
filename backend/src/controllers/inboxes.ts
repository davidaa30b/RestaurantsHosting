import express from "express";

import { getInboxes, deleteInboxById } from "../db/inboxes";
export const getAllInboxes = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const inboxes = await getInboxes();

    return res.status(200).json(inboxes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteInbox = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedInbox = await deleteInboxById(id);
    return res.json(deletedInbox);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
