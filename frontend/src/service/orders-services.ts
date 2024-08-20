export interface OrderData {
  _id: string;
  user_id: string;
  restaurant_id: string;
  dish_quantities: [
    {
      dish_id: string;
      quantity: number;
    }
  ];
  status:
    | "queued"
    | "cooking"
    | "cooked"
    | "delivering"
    | "delivered"
    | "pending";
  cook_id: string;
  delivery_id: string;
  total_price: number;
  estimated_time: number;
  cooking_start_time: Date;
  cooking_end_time: Date;
  delivery_start_time: Date;
  delivery_end_time: Date;
  time_passed: string;
}

export interface OrdersData {
  orders: OrderData[];
}

export async function getUserOrders() {
  try {
    const response = await fetch(`http://localhost:8080/user/orders`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const orders: OrderData[] = await response.json();
    return { orders: orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { orders: [] };
  }
}
export async function getStaffOrders() {
  try {
    const response = await fetch(`http://localhost:8080/staff/orders`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const orders: OrderData[] = await response.json();
    return { orders: orders };
  } catch (error) {
    console.error("Error fetching staff orders:", error);
    return { orders: [] };
  }
}
export async function getRestaurantOrdersByManager(restaurantId: string) {
  try {
    const response = await fetch(
      `http://localhost:8080/restaurants/${restaurantId}/orders`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const orders: OrderData[] = await response.json();
    return { orders: orders };
  } catch (error) {
    console.error("Error fetching manager orders:", error);
    return { orders: [] };
  }
}
