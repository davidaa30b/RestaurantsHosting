import React, { useEffect } from "react";
import { useCart } from "./CartContext";
import { useParams } from "react-router-dom";
import "../../css/Cart.css"; // Import the CSS file

const Cart = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const { restaurantId } = useParams();

  useEffect(() => {
    console.log("items", items);
  }, [items]);
  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCompleteOrder = async () => {
    console.log("items", items);
    if (window.confirm("Are you sure you want to place this order?")) {
      const dish_q = items.map((item) => {
        return {
          dish_id: item.id,
          quantity: item.quantity,
        };
      });
      console.log("dish_q", dish_q);

      const orderDetails = {
        //  dish_ids: items.map((item) => item.id),

        dish_quantities: dish_q,
        estimated_time: items.reduce(
          (acc, item) => acc + item.estimated_time * item.quantity,
          0
        ),
        total_price: items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
      };

      try {
        const response = await fetch(
          `http://localhost:8080/restaurants/${restaurantId}/create-new-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(orderDetails),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const result = await response.json();
        console.log("Order created:", result);
        alert("Order placed successfully!");
        clearCart();
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    }
  };

  return (
    <div className="cart-container">
      <h3>Shopping Cart</h3>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <p>
                <strong>{item.name}</strong> - ${item.price} x {item.quantity} -{" "}
                {item.estimated_time} mins
              </p>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total Price: </strong>$
            {items
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
          <div className="cart-total">
            <strong>Total Estimated Time: </strong>
            {items.reduce(
              (acc, item) => acc + item.estimated_time * item.quantity,
              0
            )}{" "}
            mins
          </div>
          <button onClick={handleClearCart}>Clear Cart</button>
          <button onClick={handleCompleteOrder}>Complete Order</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
