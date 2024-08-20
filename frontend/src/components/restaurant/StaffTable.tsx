import { useLoaderData, useParams } from "react-router-dom";
import { StaffData, reliefStaffMember } from "../../service/staff-services";
import { useEffect, useState } from "react";
import {
  OrderData,
  getRestaurantOrdersByManager,
} from "../../service/orders-services";
import "../../css/Staff.css"; // Import the CSS file

const StaffTable = () => {
  const staff = useLoaderData() as StaffData[];
  const [orders, setOrders] = useState<OrderData[]>();
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      let orders;
      if (restaurantId) {
        orders = await getRestaurantOrdersByManager(restaurantId);
      }
      if (orders) {
        setOrders(orders.orders);
      }
    };
    fetchOrders();
  }, []);

  async function handleReliefStaff(staff: StaffData) {
    await reliefStaffMember(staff);
    window.location.reload();
  }

  return (
    <div className="staff-table-container">
      <h2>Staff Status</h2>
      {staff.length > 0 ? (
        staff.map((s) => (
          <div key={s._id} className="staff-member-card">
            <p>
              <strong>Id:</strong> {s._id}
              <strong>Name :</strong> {s.firstName} {s.lastName}
              <strong>Email:</strong> {s.email}
            </p>
            <p>
              <strong>Role:</strong> {s.role}
              <strong>Status:</strong> {s.status}
            </p>
            <p>
              <strong>Assigned Orders:</strong>{" "}
              {s.role === "cook" &&
                orders?.filter((o) => o.cook_id === s._id).length}{" "}
              {s.role === "delivery" &&
                orders?.filter((o) => o.delivery_id === s._id).length}
            </p>
            <p>
              <strong>Finished Orders:</strong>{" "}
              {s.role === "cook" &&
                orders?.filter(
                  (o) =>
                    o.cook_id === s._id &&
                    o.status !== "pending" &&
                    o.status !== "cooking"
                ).length}{" "}
              {s.role === "delivery" &&
                orders?.filter(
                  (o) => o.delivery_id === s._id && o.status === "delivered"
                ).length}
            </p>
            <button onClick={() => handleReliefStaff(s)}>
              Relief staff member
            </button>
          </div>
        ))
      ) : (
        <p className="no-staff-message">
          No staff members found for this restaurant.
        </p>
      )}
    </div>
  );
};

export default StaffTable;
