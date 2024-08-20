import { useState, useEffect, ChangeEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { io } from "socket.io-client";
import { OrderData, OrdersData } from "../../service/orders-services";
import "../../css/Orders.css";
import { getStaffMemberById } from "../../service/staff-services";
import { getUserById } from "../../service/users-service";
import {
  RestaurantData,
  getRestaurantById,
} from "../../service/restaurant-services";
import { getDishes } from "../../service/dishes-services";

function StaffOrders() {
  const { orders } = useLoaderData() as OrdersData;
  const [updatedOrders, setOrders] = useState(orders);
  const [filteredOrders, setFilteredOrders] = useState(updatedOrders);
  const [isAscending, setIsAscending] = useState(true); // For sorting order
  const [isBusy, setIsBusy] = useState(false);
  const [clientEmails, setClientEmails] = useState<Record<string, string>>({});
  const [restaurant, setRestaurant] = useState<RestaurantData>();
  const [dishName, setDishName] = useState<Record<string, string>>({});

  const curRole = localStorage.getItem("userRole");
  const curUserId = localStorage.getItem("userId");

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("order_cooking", (updatedOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("order_cooked", (updatedOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("order_delivering", (updatedOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("order_delivered", (updatedOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchDishes() {
      const dishName: Record<string, string> = {};
      const dishes = await getDishes();
      if (dishes) {
        dishes.dishes.forEach((d) => {
          dishName[d._id] = d.name;
        });
        setDishName(dishName);
      }
    }

    fetchDishes();
  }, []);

  useEffect(() => {
    async function getStaffStatus() {
      if (curUserId) {
        const staff = await getStaffMemberById(curUserId);

        if (staff) {
          const restaurant = await getRestaurantById(staff.restaurant_id);

          setIsBusy(staff.status !== "free");
          console.log(staff);
          console.log("isBusy", isBusy);
          if (restaurant) {
            setRestaurant(restaurant);
          }
        }
      }
    }

    async function fetchClientEmails() {
      const clientEmails: Record<string, string> = {};

      // Using Promise.all to wait for all fetches to complete
      await Promise.all(
        orders.map(async (o) => {
          const user = await getUserById(o.user_id);
          if (user) {
            clientEmails[o.user_id] = user.email;
          }
        })
      );

      setClientEmails(clientEmails); // Update the state only after all emails are fetched
    }

    getStaffStatus();
    fetchClientEmails();
  }, [orders]);

  const handleOrderStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    if (selectedStatus === "all") {
      setFilteredOrders(updatedOrders);
    } else {
      setFilteredOrders(
        updatedOrders.filter((o) => o.status === selectedStatus)
      );
    }
  };

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const dateA = a.delivery_end_time
        ? new Date(a.delivery_end_time).getTime()
        : null;
      const dateB = b.delivery_end_time
        ? new Date(b.delivery_end_time).getTime()
        : null;

      if (dateA === null && dateB === null) return 0;
      if (dateA === null) return isAscending ? 1 : -1;
      if (dateB === null) return isAscending ? -1 : 1;

      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sortedOrders);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    console.log("Updating order status: ", orderId, newStatus);
    await fetch(
      `http://localhost:8080/staff/orders/${orderId}/mark-as-${newStatus}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
  };

  function getFullDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="staff-orders-container">
      <h1>Restaurant Orders for {restaurant && restaurant.name}</h1>
      <div className="staff-orders-controls">
        <h3>Filter by :</h3>
        <label>
          Status:
          <select onChange={handleOrderStatus}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="cooking">Cooking</option>
            <option value="cooked">Cooked</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>
        <button onClick={toggleSortOrder}>
          Sort by Delivery Date: {isAscending ? "Ascending" : "Descending"}
        </button>
      </div>
      <ul className="staff-orders-list">
        {filteredOrders[0] ? (
          filteredOrders.map((order) => (
            <li key={order._id}>
              <div>
                <strong>Order #</strong>
                {order._id} - <strong>Status:</strong> {order.status} ,{" "}
                <strong>Client email:</strong> {clientEmails[order.user_id]},
              </div>
              <div className="order-detail">
                <span>Dishes:</span>{" "}
                {order.dish_quantities.map((dish_q) => {
                  return (
                    <div>
                      {dishName[dish_q.dish_id]} {" x "} {dish_q.quantity}{" "}
                    </div>
                  );
                })}
              </div>
              <hr />
              <div>
                <strong>Order Cooked : </strong>
                {order.delivery_end_time
                  ? getFullDate(new Date(order.cooking_end_time))
                  : "awaiting"}
                : <strong>Order Deliverd :</strong>{" "}
                {order.delivery_end_time
                  ? getFullDate(new Date(order.delivery_end_time))
                  : "awaiting"}
              </div>
              <hr />
              <div>
                <strong>Estemated time for cooking:</strong>{" "}
                {order.estimated_time}minutes <strong>Price:</strong>{" "}
                {order.total_price}$
              </div>
              {order.status === "pending" && curRole === "cook" && (
                <div className="order-actions">
                  <button
                    disabled={isBusy}
                    style={{ backgroundColor: isBusy ? "red" : "#218838" }}
                    onClick={() => {
                      handleUpdateOrderStatus(order._id, "cooking");
                      window.location.reload();
                    }}
                  >
                    Mark as Cooking
                  </button>
                </div>
              )}
              {order.status === "cooking" && curRole === "cook" && (
                <div className="order-actions">
                  <button
                    disabled={!(order.cook_id === curUserId)}
                    style={{
                      backgroundColor: !(order.cook_id === curUserId)
                        ? "red"
                        : "#218838",
                    }}
                    onClick={() => {
                      handleUpdateOrderStatus(order._id, "cooked");
                      window.location.reload();
                    }}
                  >
                    Mark as Cooked
                  </button>
                </div>
              )}
              {order.status === "cooked" && curRole === "delivery" && (
                <div className="order-actions">
                  <button
                    disabled={isBusy}
                    style={{ backgroundColor: isBusy ? "red" : "#218838" }}
                    onClick={() => {
                      handleUpdateOrderStatus(order._id, "delivering");
                      window.location.reload();
                    }}
                  >
                    Mark as Delivering
                  </button>
                </div>
              )}
              {order.status === "delivering" && curRole === "delivery" && (
                <div className="order-actions">
                  <button
                    disabled={!(order.delivery_id === curUserId)}
                    style={{
                      backgroundColor: !(order.delivery_id === curUserId)
                        ? "red"
                        : "#218838",
                    }}
                    onClick={() => {
                      handleUpdateOrderStatus(order._id, "delivered");
                      window.location.reload();
                    }}
                  >
                    Mark as Delivered
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <div>No orders are present</div>
        )}
      </ul>
    </div>
  );
}

export default StaffOrders;
