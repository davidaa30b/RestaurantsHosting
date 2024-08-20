import { useState, useEffect, ChangeEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { io } from "socket.io-client";
import { OrderData, OrdersData } from "../../service/orders-services";
import "../../css/Orders.css";
import { getDishes } from "../../service/dishes-services";

function UserOrders() {
  const { orders } = useLoaderData() as OrdersData;
  const [updatedOrders, setOrders] = useState(orders);
  const [filteredOrders, setFilteredOrders] = useState(updatedOrders);
  const [isAscending, setIsAscending] = useState(true); // For sorting order
  const [dishName, setDishName] = useState<Record<string, string>>({});

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("order_cooking", (cookingOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === cookingOrder._id ? cookingOrder : order
        )
      );
    });

    socket.on("order_cooked", (cookedOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === cookedOrder._id ? cookedOrder : order
        )
      );
    });

    socket.on("order_delivering", (deliveringOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === deliveringOrder._id ? deliveringOrder : order
        )
      );
    });

    socket.on("order_delivered", (deliveredOrder: OrderData) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === deliveredOrder._id ? deliveredOrder : order
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "cooking" || order.status === "delivering") {
            const now = new Date().getTime();
            let timePassed = "";

            if (order.status === "cooking" && order.cooking_start_time) {
              const timeSinceCookingStarted = Math.floor(
                (now - new Date(order.cooking_start_time).getTime()) / 1000
              );
              timePassed = formatTime(timeSinceCookingStarted);
            } else if (
              order.status === "delivering" &&
              order.delivery_start_time
            ) {
              const timeSinceDeliveringStarted = Math.floor(
                (now - new Date(order.delivery_start_time).getTime()) / 1000
              );
              timePassed = formatTime(timeSinceDeliveringStarted);
            }

            order.time_passed = timePassed;
            return order;
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
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
    console.log("NIgaggagagagaga", orders);

    fetchDishes();
  }, []);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

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
    <div className="user-orders-container">
      <h1>Your Orders</h1>
      <div className="user-orders-controls">
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
      <ul className="user-orders-list">
        {filteredOrders[0] ? (
          filteredOrders.map((order) => (
            <li key={order._id}>
              <h4>Order #{order._id}</h4>
              <div className="order-detail">
                <span>Status:</span> {order.status}
              </div>
              <div className="order-detail">
                <span>Estemated time for cooking:</span> {order.estimated_time}
                minutes
              </div>
              <div className="order-detail">
                <span>Price:</span> {order.total_price}$
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
              {order.cooking_start_time && (
                <div className="order-detail">
                  <span>Cooking Started At:</span>{" "}
                  {new Date(order.cooking_start_time).toLocaleTimeString()}
                </div>
              )}
              {order.status === "cooking" && order.time_passed && (
                <div className="order-detail">
                  <span>Cooking for:</span> {order.time_passed}
                </div>
              )}
              {order.cooking_end_time && (
                <div className="order-detail">
                  <span>Cooking Ended At:</span>{" "}
                  {new Date(order.cooking_end_time).toLocaleTimeString()}
                </div>
              )}
              {order.delivery_start_time && (
                <div className="order-detail">
                  <span>Delivery Started At:</span>{" "}
                  {new Date(order.delivery_start_time).toLocaleTimeString()}
                </div>
              )}
              {order.status === "delivering" && order.time_passed && (
                <div className="order-detail">
                  <span>Delivering for:</span> {order.time_passed}
                </div>
              )}
              {order.delivery_end_time && (
                <div className="order-detail">
                  <span>Delivery Ended At:</span>{" "}
                  {new Date(order.delivery_end_time).toLocaleTimeString()}
                </div>
              )}
              <div className="order-detail">
                <span>Completion Date:</span>{" "}
                {order.delivery_end_time
                  ? getFullDate(new Date(order.delivery_end_time))
                  : "awaiting"}
              </div>
            </li>
          ))
        ) : (
          <div>No orders are present</div>
        )}
      </ul>
    </div>
  );
}

export default UserOrders;
