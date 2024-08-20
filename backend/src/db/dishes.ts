import mongoose from "mongoose";

export interface IDish {
  _id: mongoose.Types.ObjectId;
  restaurant_id: mongoose.Types.ObjectId;
  name: string;
  image: string;
  description?: string;
  ratings?: number;
  price: number;
  estimated_time: number;
}

const DishSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: false },
  ratings: [{ type: Number, required: false }],
  price: { type: Number, required: true },
  estimated_time: { type: Number, required: true },
});

export const DishModel = mongoose.model("Dish", DishSchema);

export const getDishes = () => DishModel.find();
export const getDishById = (id: string) => DishModel.findById(id);
export const createDish = (values: Record<string, any>) =>
  new DishModel(values).save().then((dish) => dish.toObject());
export const deleteDishById = (id: string) =>
  DishModel.findByIdAndDelete({ _id: id });
export const updateDishById = (id: string, values: Record<string, any>) =>
  DishModel.findByIdAndUpdate(id, values);
