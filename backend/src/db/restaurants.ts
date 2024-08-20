import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  staff_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
  dishes_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
  address: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },

  ratings: [
    {
      type: Number,
      min: 1,
      max: 5,
      required: false,
    },
  ],
  availableCookPositions: { type: Number, required: true },
  availableDeliveryPositions: { type: Number, required: true },
});

export const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);

export const getRestaurants = () => RestaurantModel.find();
export const getRestaurantById = (id: string) => RestaurantModel.findById(id);

export const createRestaurant = (values: Record<string, any>) =>
  new RestaurantModel(values)
    .save()
    .then((restaurant) => restaurant.toObject());

export const deleteRestaurantById = (id: string) =>
  RestaurantModel.findByIdAndDelete({ _id: id });
export const updateRestaurantById = (id: string, values: Record<string, any>) =>
  RestaurantModel.findByIdAndUpdate(id, values, { new: true });

export const getRestaurantByManagerId = (manager_id: string) =>
  RestaurantModel.findOne({ manager_id });
