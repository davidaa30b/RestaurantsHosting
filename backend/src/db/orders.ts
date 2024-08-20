import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dish_quantities: [
    {
      dish_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: ["queued", "cooking", "cooked", "delivering", "delivered", "pending"],
    default: "pending",
  },
  cook_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    default: null,
  },
  delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    default: null,
  },
  total_price: { type: Number, required: true },
  estimated_time: { type: Number, required: true },
  cooking_start_time: Date,
  cooking_end_time: Date,
  delivery_start_time: Date,
  delivery_end_time: Date,
});

export const OrderModel = mongoose.model("Order", OrderSchema);
export const createOrder = (values: Record<string, any>) =>
  new OrderModel(values).save().then((order) => order.toObject());
export const updateOrderStatus = (id: string, status: string) =>
  OrderModel.findByIdAndUpdate(id, { status }, { new: true });
export const getOrderById = (id: string) => OrderModel.findById(id);

export const getOrders = () => OrderModel.find();

export const updateOrderById = (id: string, values: Record<string, any>) =>
  OrderModel.findByIdAndUpdate(id, values);
