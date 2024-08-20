import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import About from "./components/About";
import NoMatch from "./components/NoMatch";
import {
  getCurrentUser,
  getUsers,
  userAction,
  userFormAction,
  userLoader,
} from "./service/users-service";
import ErrorPage from "./components/ErrorPage";
import { UserRegister } from "./components/user/UserRegister";
import { Login } from "./components/auth/Login";
import Users from "./components/user/Users";
import UserDetails from "./components/user/UserDetails";
import UserDetailsForm from "./components/user/UserDetailsForm";

import { ApplyForManager } from "./components/user/ApplyforManager";
import {
  getInboxes,
  inboxAction,
  inboxApproveJobApplicationAction,
  inboxFormReplayManagerApplicationAction,
  inboxLoader,
} from "./service/inboxes-services";
import InboxDetails from "./components/inbox/InboxDetails";
import Inboxes from "./components/inbox/Inboxes";
import ReplayInbox from "./components/inbox/ReplayInbox";
import ResturantCreator from "./components/restaurant/ResturantCreator";
import {
  dishesLoader,
  getRestaurants,
  menuAction,
  restaurantAction,
  restaurantApplyForJobAction,
  restaurantFormAction,
  restaurantFormAddDishAction,
  restaurantLoader,
} from "./service/restaurant-services";
import Restaurants from "./components/restaurant/Restaurants";
import RestaurantDetails from "./components/restaurant/RestaurantDetails";
import RestauranDetailsForm from "./components/restaurant/RestauranDetailsForm";
import AddingDishToRestaurant from "./components/restaurant/AddingDishToRestaurant";
import Menu from "./components/restaurant/Menu";
import JobApplicationForRestaurant from "./components/restaurant/JobApplicationForRestaurant";
import { LoginStaff } from "./components/auth/LoginStaff";
import { CartProvider } from "./components/order/CartContext";
import Cart from "./components/order/Cart";
import { getStaffOrders, getUserOrders } from "./service/orders-services";
import UserOrders from "./components/orders/UserOrders";
import StaffOrders from "./components/orders/StaffOrders";
import StaffTable from "./components/restaurant/StaffTable";
import { staffByRestaurantIdLoader } from "./service/staff-services";
import DishDetailsForm from "./components/restaurant/DishDetailsForm";
import { dishFormAction, dishLoader } from "./service/dishes-services";

const router = createBrowserRouter([
  {
    element: <Layout />,

    children: [
      { index: true, loader: getRestaurants, element: <Home /> },
      { path: "/home", loader: getRestaurants, element: <Home /> },

      { path: "/register", element: <UserRegister /> },
      { path: "/login", element: <Login /> },
      { path: "/loginStaff", element: <LoginStaff /> },
      {
        path: "/users",
        loader: getUsers,
        shouldRevalidate: ({ currentUrl }) => {
          console.log(currentUrl);
          return !currentUrl.pathname.startsWith("/users");
        },
        element: <Users />,
        children: [
          {
            path: ":userId/*",
            loader: userLoader,
            action: userAction,
            element: <UserDetails />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":userId/edit",
            loader: userLoader,
            action: userFormAction,
            shouldRevalidate: ({ actionResult }) => !actionResult?.errors,
            element: <UserDetailsForm />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "/apply-for-manager",
        element: <ApplyForManager />,
      },
      {
        path: "/inboxes",
        loader: getInboxes,
        shouldRevalidate: ({ currentUrl }) => {
          console.log(currentUrl);
          return !currentUrl.pathname.startsWith("/inboxes");
        },
        element: <Inboxes />,
        children: [
          {
            path: ":inboxId/*",
            loader: inboxLoader,
            action: inboxAction,
            element: <InboxDetails />,
            errorElement: <ErrorPage />,
          },

          {
            path: ":inboxId/replay-manager-application",
            action: inboxFormReplayManagerApplicationAction,
            element: <ReplayInbox />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":inboxId/approve-job-application/:approve",
            action: inboxApproveJobApplicationAction,
            errorElement: <ErrorPage />,
          },
        ],
      },
      { path: "/create-new-restaurant", element: <ResturantCreator /> },
      {
        path: "/restaurants",
        loader: getRestaurants,
        shouldRevalidate: ({ currentUrl }) => {
          return !currentUrl.pathname.startsWith("/restaurants");
        },
        element: <Restaurants />,
        children: [
          {
            path: ":restaurantId/*",
            loader: restaurantLoader,
            action: restaurantAction,
            element: <RestaurantDetails />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":restaurantId/menu",
            loader: dishesLoader,
            action: menuAction,
            element: <Menu />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: "cart",
                element: <Cart />,
              },
              {
                path: ":dishId/edit",
                loader: dishLoader,
                action: dishFormAction,
                shouldRevalidate: ({ actionResult }) => !actionResult?.errors,
                element: <DishDetailsForm />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: ":restaurantId/edit",
            loader: restaurantLoader,
            action: restaurantFormAction,
            shouldRevalidate: ({ actionResult }) => !actionResult?.errors,
            element: <RestauranDetailsForm />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":restaurantId/apply-for-job",
            action: restaurantApplyForJobAction,
            element: <JobApplicationForRestaurant />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":restaurantId/add-dish-to-restautant",
            action: restaurantFormAddDishAction,
            element: <AddingDishToRestaurant />,
            errorElement: <ErrorPage />,
          },
          {
            path: ":restaurantId/staff-table",
            loader: staffByRestaurantIdLoader,
            element: <StaffTable />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "/user/orders",
        loader: getUserOrders,
        element: <UserOrders />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/staff/orders",
        loader: getStaffOrders,
        element: <StaffOrders />,
        errorElement: <ErrorPage />,
      },

      { path: "/about", element: <About /> },
      { path: "*", element: <NoMatch /> },
    ],
  },
]);

function App() {
  sessionStorage.setItem("userId", "");
  sessionStorage.setItem("userRole", "");
  sessionStorage.setItem("sessionToken", "");
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;
