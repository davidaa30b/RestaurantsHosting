import { Server, Socket } from "socket.io";
import http from "http";
import { updateOrderStaff, reliefStaff } from "./staff";
import { createNewOrder } from "./users";

let io: Server;

export const setupSocketIO = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    // Handle order update events from client
    socket.on(
      "update_order_staff",
      async (data: { orderId: string; staffId: string }) => {
        try {
          const req: any = {
            params: { order_id: data.orderId },
            identityStaff: { _id: data.staffId },
          }; // Mocked request object
          const res: any = {}; // Mocked response object
          await updateOrderStaff(req, res);
        } catch (error) {
          console.error("Error updating order via socket:", error);
        }
      }
    );

    // Handle staff relief events from client
    socket.on(
      "relief_staff",
      async (data: { orderId: string; staffId: string }) => {
        try {
          const req: any = {
            params: { order_id: data.orderId },
            identityStaff: { _id: data.staffId },
          }; // Mocked request object
          const res: any = {}; // Mocked response object
          await reliefStaff(req, res);
        } catch (error) {
          console.error("Error relieving staff via socket:", error);
        }
      }
    );

    // Handle new order creation events from client
    socket.on(
      "create_new_order",
      async (data: {
        restaurantId: string;
        dishIds: string[];
        estimatedTime: number;
        userId: string;
      }) => {
        try {
          const req: any = {
            params: { restaurant_id: data.restaurantId },
            body: {
              dish_ids: data.dishIds,
              estimated_time: data.estimatedTime,
            },
            identity: { _id: data.userId },
          }; // Mocked request object
          const res: any = {}; // Mocked response object
          await createNewOrder(req, res);
        } catch (error) {
          console.error("Error creating new order via socket:", error);
        }
      }
    );
  });
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
};
