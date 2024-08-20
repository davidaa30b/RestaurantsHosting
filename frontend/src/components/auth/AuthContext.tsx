import React, { ReactNode, createContext, useContext } from "react";
import { LoginData } from "../../service/users-service";

interface AuthContextType {
  login: (loginUser: LoginData) => Promise<boolean>;
  loginStaff: (specialToken: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutStaff: () => Promise<void>;
  resignStaff: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  login: async () => false,
  loginStaff: async () => {},
  logout: async () => {},
  logoutStaff: async () => {},
  resignStaff: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const login = async (loginUser: LoginData) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials to allow cookies
        body: JSON.stringify(loginUser),
      });

      if (!response.ok) {
        //throw new Error("Failed to login user");
        return false;
      } else {
        const user = await response.json();

        localStorage.setItem("userId", user._id);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("sessionToken", user.authentication.sessionToken);

        return true;
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      return false;
    }
  };

  const loginStaff = async (specialToken: string) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials to allow cookies
        body: JSON.stringify({ token: specialToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to login user");
      }

      const staff = await response.json();

      localStorage.setItem("userId", staff._id);
      localStorage.setItem("userRole", staff.role);
      localStorage.setItem("sessionToken", staff.authentication.sessionToken);

      window.location.reload();
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure credentials (cookies) are sent
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to logout user");
      }
    } catch (error) {
      console.error("Error logout user:", error);
    }
  };

  const logoutStaff = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure credentials (cookies) are sent
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to logout staff");
      }
    } catch (error) {
      console.error("Error logout staff:", error);
    }
  };
  const resignStaff = async () => {
    try {
      const response = await fetch("http://localhost:8080/staff/resign", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure credentials (cookies) are sent
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to resign staff");
      }
    } catch (error) {
      console.error("Error resigning staff:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, loginStaff, logoutStaff, resignStaff }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
