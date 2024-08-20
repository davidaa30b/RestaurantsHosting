import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["cook", "delivery"],
    required: true,
    default: "staff",
  },
  status: { type: String, enum: ["free", "busy"], default: null },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  authentication: {
    loginToken: { type: String, required: true },
    sessionToken: { type: String, select: false },
  },
});

export const StaffModel = mongoose.model("Staff", StaffSchema);

export const getStaff = () => StaffModel.find();
export const getStaffById = (id: string) => StaffModel.findById(id);
export const createStaff = (values: Record<string, any>) =>
  new StaffModel(values).save().then((staff) => staff.toObject());

export const deleteStaffById = (id: string) =>
  StaffModel.findByIdAndDelete({ _id: id });

export const updateStaffById = (id: string, values: Record<string, any>) =>
  StaffModel.findByIdAndUpdate(id, values);

export const getStaffByLoginToken = (loginToken: string) =>
  StaffModel.findOne({ "authentication.loginToken": loginToken });

export const getStaffBySessionToken = (sessionToken: string) =>
  StaffModel.findOne({ "authentication.sessionToken": sessionToken });

export const getFreeStaff = (role: string) =>
  StaffModel.findOne({ role, status: "free" });

export const getStaffByRestaurantIdAndStatus = (
  restaurant_id: string,
  status: string
) => StaffModel.find({ restaurant_id, status });
