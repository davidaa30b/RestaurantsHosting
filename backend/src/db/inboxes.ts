import mongoose from "mongoose";

const InboxSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  sender_type: {
    type: String,
    enum: ["Admin", "Manager", "User", "Restaurant", "Staff"],
    required: false,
  },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipient_type: {
    type: String,
    enum: ["Admin", "Manager", "User", "Restaurant", "Staff"],
    required: false,
  },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["managerApplication", "jobApplication"],
    required: true,
  },
  position: { type: String, enum: ["cook", "delivery"], required: false },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: false,
  },
  created_at: { type: Date, default: Date.now },
});

export const InboxModel = mongoose.model("Inbox", InboxSchema);

export async function createApplyForManagerInboxes(
  group: any[],
  senderId: string,
  message: string
) {
  for (const person of group) {
    const inboxEntry = new InboxModel({
      sender_id: senderId,
      sender_type: "User",
      recipient_id: person._id,
      recipient_type: "Admin",
      message: message,
      type: "managerApplication",
    });
    await inboxEntry.save();
  }
}

export const createInbox = (values: Record<string, any>) =>
  new InboxModel(values).save().then((inboxEntry) => inboxEntry.toObject());

export function getInboxById(inboxId: string) {
  return InboxModel.findById(inboxId).populate("sender_id");
}

export const deleteAllInboxesBySenderId = (senderId: string) => {
  return InboxModel.deleteMany({ sender_id: senderId });
};

export const updateInboxById = (id: string, values: Record<string, any>) =>
  InboxModel.findByIdAndUpdate(id, values, { new: true });

export const getInboxes = () => InboxModel.find();

export const deleteInboxById = (id: string) =>
  InboxModel.findByIdAndDelete({ _id: id });
