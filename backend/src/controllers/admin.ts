import express from "express";
import { getInboxById } from "../db/inboxes";
import { updateUserById } from "../db/users";
import { createInbox } from "../db/inboxes";
import { get } from "lodash";

export const approveManagerApplication = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("here");
  const { inboxId } = req.params;

  const { approve, message } = req.body;
  console.log("approve: ", approve, ",message: ", message);

  try {
    const inboxEntry = await getInboxById(inboxId);
    const currentUserId = get(req, "identity._id") as string;

    if (!inboxEntry) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (approve) {
      await updateUserById(inboxEntry.sender_id._id.toString(), {
        role: "manager",
      });
    }

    createInbox({
      sender_id: currentUserId.toString(),
      sender_type: "Admin",
      recipient_id: inboxEntry.sender_id._id.toString(),
      recipient_type: "User",
      message: message,
      type: "managerApplication",
    });

    res.status(200).json({
      message: `Application ${approve ? "approved" : "rejected"} successfully.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process application." });
  }
};
