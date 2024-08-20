import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";

export type GenderType = "male" | "female";

export interface UsersData {
  users: UserData[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  conclude?: string;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  gender: GenderType;
  role: "user" | "admin" | "manager";
  image?: string;
  email: string;
  status: "active" | "suspended" | "deactivated";
  registerDate: string;
  latestModification: string;
  authentication: {
    sessionToken: string;
  };
}

export interface UserErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  gender?: string;
  role?: string;
  image?: string;
  bio?: string;
  status?: string;
  conclude?: string;
}

export interface UserActionResult {
  errors: UserErrors;
  values: UserData;
}

export async function getCurrentUser() {
  try {
    const response = await fetch("http://localhost:8080/current-user", {
      method: "GET",
      credentials: "include", // Include credentials to send cookies
    });

    if (response.ok) {
      const currentUser: UserData = await response.json();
      return currentUser;
    } else {
      console.error("Failed to fetch current user");
      return {} as UserData;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    return {} as UserData;
  }
}

export async function getUsers() {
  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const users: UserData[] = await response.json();
    return { users: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };
  }
}

export async function getUserById(id: string) {
  const data: UsersData = await getUsers();
  return data.users.find((c) => c._id === id);
}

export async function getAdmin() {
  const data: UsersData = await getUsers();
  return data.users.find((c) => c.role === "admin");
}

export async function getUserBySessionToken(sessionToken: string) {
  const data: UsersData = await getUsers();
  return data.users.find((c) => c.authentication.sessionToken === sessionToken);
}
export async function getUserByEmail(email: string) {
  const data: UsersData = await getUsers();
  return data.users.find((c) => c.email === email);
}

export async function getUserByUsername(username: string) {
  const data: UsersData = await getUsers();
  return data.users.find((c) => c.username === username);
}

export async function userLoader({ request, params }: LoaderFunctionArgs) {
  const data: UsersData = await getUsers();
  console.log("data nigga", data);
  if (params.userId && data.users.some((c) => c._id === params?.userId)) {
    return getUserById(params.userId);
  } else {
    throw new Error(`Invalid or missing post ID`);
  }
}

async function deleteUserById(userId: string) {
  fetch(`http://localhost:8080/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      console.log("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

export async function userAction({ request, params }: ActionFunctionArgs) {
  const curUser = await getCurrentUser();

  if (request.method === "DELETE") {
    params.userId && (await deleteUserById(params.userId));

    if (params.userId === curUser._id) {
      localStorage.setItem("sessionToken", "");
      return redirect("/home");
    } else {
      window.location.reload();
      return redirect("/users");
    }
  } else if (request.method === "PUT") {
    return redirect(`/users/${params.userId}/edit`);
  }
}

async function updateUser(user: UserData) {
  console.log(user._id);
  fetch(`http://localhost:8080/users/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",

    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      console.log("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

export async function userFormAction({ request, params }: ActionFunctionArgs) {
  const errors: UserErrors = {};
  if (request.method === "PUT") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let formData = await request.formData();
    const user = Object.fromEntries(formData) as unknown as UserData;
    user._id = params.userId!;
    console.log(user);

    if (user.firstName === "" || user.lastName === "" || user.username === "") {
      errors.conclude =
        "Error. First and last name and username fields must be filled .";
    }

    if (user.username.length > 15) {
      errors.username =
        "Error. Username length is over the limit of 15 characters.";
    }

    if (!emailRegex.test(user.email)) {
      errors.bio = "Error. Entered email is invalid.";
    }

    if (Object.keys(errors).length) {
      return { errors, values: user };
    }

    await updateUser(user);
    return redirect(`/users/${params.userId}`);
  }
}
