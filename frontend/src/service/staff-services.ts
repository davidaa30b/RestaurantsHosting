import { LoaderFunctionArgs } from "react-router-dom";

export interface ErrorLoginStaff {
  loginToken?: string;
}

export interface StaffData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "free" | "busy";
  restaurant_id: string;
  authentication: {
    loginToken: string;
    sessionToken: string;
  };
}

export interface AllStaffData {
  staff: StaffData[];
}

export async function getStaff() {
  try {
    const response = await fetch("http://localhost:8080/staff", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const staff: StaffData[] = await response.json();
    return { staff: staff };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { staff: [] };
  }
}

export async function getStaffMemberById(id: string) {
  const data: AllStaffData = await getStaff();
  return data.staff.find((s) => s._id === id);
}

export async function getStaffMemberByLoginToken(loginToken: string) {
  const data: AllStaffData = await getStaff();
  return data.staff.find((s) => s.authentication.loginToken === loginToken);
}
export async function getStaffMemberByEmail(email: string) {
  const data: AllStaffData = await getStaff();
  return data.staff.find((s) => s.email === email);
}
export async function staffByRestaurantIdLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  console.log("fresco", params.restaurantId);

  const data: AllStaffData = await getStaff();

  const staffMemmbersFromRestaurant = data.staff.filter(
    (s) => s.restaurant_id === params.restaurantId
  );

  console.log("staffMemmbersFromRestaurant", staffMemmbersFromRestaurant);
  return staffMemmbersFromRestaurant;
}

export async function reliefStaffMember(staffMember: StaffData) {
  try {
    const response = await fetch(
      `http://localhost:8080/restaurants/${staffMember.restaurant_id}/staff-table/${staffMember._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log("Staff deleted successfully");
  } catch (error) {
    console.error("Error deleting staff:", error);
  }
}
