import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../css/Layout.css";
import { useAuth } from "./auth/AuthContext";
import { UserData } from "../service/users-service";
import { useEffect, useState } from "react";
import { getUserById } from "../service/users-service";
import { StaffData, getStaffMemberById } from "../service/staff-services";
import { Footer } from "./Footer";
import { BigBlock } from "./BigBlock";

type Props = {};

const Layout = (props: Props) => {
  const navigate = useNavigate();
  const [curUser, setCurrentUser] = useState<UserData | StaffData | null>(null);

  const { logout, logoutStaff, resignStaff } = useAuth();
  const setRole = localStorage.getItem("userRole");
  const setSessionToken = localStorage.getItem("sessionToken");
  const setUserId = localStorage.getItem("userId");
  const curUserSessionToken = setSessionToken !== "" ? setSessionToken : null;
  const curRole = setRole !== "" ? setRole : null;
  const curUserId = setUserId !== "" ? setUserId : null;

  useEffect(() => {
    const getCurUser = async () => {
      if (curUserId) {
        const user = await getUserById(curUserId);
        if (user) {
          setCurrentUser(user);
        }
      }
    };
    const getCurStaffMember = async () => {
      if (curUserId) {
        const user = await getStaffMemberById(curUserId);
        if (user) {
          setCurrentUser(user);
        }
      }
    };

    if (curRole === "cook" || curRole === "delivery") {
      getCurStaffMember();
    } else {
      getCurUser();
    }
  }, [curUser, curRole, curUserId]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        if (curRole === "cook" || curRole === "delivery") {
          logoutStaff();
        } else {
          logout();
        }
        localStorage.setItem("sessionToken", "");
        localStorage.setItem("userRole", "");
        localStorage.setItem("userId", "");

        navigate("/home");

        console.log("Logged out successfully");
      } catch (error) {
        console.log("Log out error:", error);
      }
    }
  };

  const handleResign = () => {
    const confirmResign = window.confirm(
      "Are you sure you want to resign? This action cannot be undone."
    );
    if (confirmResign) {
      try {
        resignStaff();
        localStorage.setItem("sessionToken", "");
        localStorage.setItem("userRole", "");
        localStorage.setItem("userId", "");

        navigate("/home");

        console.log("Resigned out successfully");
      } catch (error) {
        console.log("Resign error:", error);
      }
    }
  };

  return (
    <>
      <nav className="nav-layout">
        <span id="user-session">
          {curUserSessionToken &&
            `Logged as ${curUser?.firstName} ${curUser?.lastName}`}
        </span>
        {curRole !== "cook" && curRole !== "delivery" && (
          <NavLink to="/home">Home</NavLink>
        )}

        {!curUserSessionToken && <NavLink to="/register">Register</NavLink>}
        {!curUserSessionToken && <NavLink to="/login">Login</NavLink>}
        {!curUserSessionToken && (
          <NavLink to="/loginStaff">Login staff member</NavLink>
        )}

        {curUserSessionToken && curRole === "admin" && (
          <NavLink to="/users">Users</NavLink>
        )}
        {curUserSessionToken && curRole === "user" && (
          <NavLink to="/apply-for-manager">Apply for manager</NavLink>
        )}
        {curUserSessionToken &&
          curRole !== "cook" &&
          curRole !== "delivery" && <NavLink to="/inboxes">Inbox</NavLink>}
        {curUserSessionToken && curRole === "manager" && (
          <NavLink to="/create-new-restaurant">Create Restaurant</NavLink>
        )}
        {curUserSessionToken &&
          curRole !== "cook" &&
          curRole !== "delivery" && (
            <NavLink to="/restaurants">
              {curRole === "manager" && "My Restaurants"}
              {curRole !== "manager" && "Restaurants"}
            </NavLink>
          )}
        {curUserSessionToken && curRole === "user" && (
          <NavLink to="/user/orders">Orders</NavLink>
        )}
        {curUserSessionToken &&
          (curRole === "cook" || curRole === "delivery") && (
            <NavLink to="/staff/orders">Orders</NavLink>
          )}
        {curUserSessionToken &&
          (curRole === "cook" || curRole === "delivery") && (
            <span className="resign-button" onClick={handleResign}>
              Resign
            </span>
          )}
        {curUserSessionToken &&
          curRole !== "cook" &&
          curRole !== "delivery" && (
            <NavLink to={`/users/${curUserId}`}>Profile</NavLink>
          )}

        <NavLink to="/about">About</NavLink>
        {curUserSessionToken && (
          <span className="logout-button" onClick={handleLogout}>
            Logout
          </span>
        )}
      </nav>
      <main>
        <Outlet />
        <BigBlock />
        <Footer />
      </main>
    </>
  );
};

export default Layout;
