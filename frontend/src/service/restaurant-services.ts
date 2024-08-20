import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import { DishData } from "./dishes-services";
import { ApplyForJobMessage } from "./inboxes-services";

export interface RatingErrors {
  rating?: string;
  id?: string;
}

export interface RestaurantsData {
  restaurants: RestaurantData[];
}
export interface RestaurantErrors {
  name?: string;
  description?: string;
  address?: string;
}

export interface RestaurantActionResult {
  errors: RestaurantErrors;
  values: RestaurantData;
}

export interface RestaurantData {
  _id: string;
  name: string;
  manager_id: string;
  staff_ids: string[];
  dishes_ids: string[];
  address: string;
  description: string;
  image: string;
  ratings: number[];
  availableCookPositions: number;
  availableDeliveryPositions: number;
}

export async function getRestaurants() {
  try {
    const response = await fetch("http://localhost:8080/restaurants", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const restaurants: RestaurantData[] = await response.json();
    return { restaurants: restaurants };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { restaurants: [] };
  }
}

export async function getRstaurantById(id: string) {
  const data: RestaurantsData = await getRestaurants();
  return data.restaurants.find((r) => r._id === id);
}

export async function dishesLoader({ request, params }: LoaderFunctionArgs) {
  try {
    const response = await fetch(
      `http://localhost:8080/restaurants/${params.restaurantId}/menu`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const dishes: DishData[] = await response.json();
    return { dishes: dishes };
  } catch (error) {
    console.error("Error fetching menu for restaurants:", error);
    return { dishes: [] };
  }
}

export async function getRestaurantById(id: string) {
  const data: RestaurantsData = await getRestaurants();
  return data.restaurants.find((r) => r._id === id);
}

export async function restaurantLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  const data: RestaurantsData = await getRestaurants();
  if (
    params.restaurantId &&
    data.restaurants.some((r) => r._id === params?.restaurantId)
  ) {
    return getRestaurantById(params.restaurantId);
  } else {
    throw new Error(`Invalid or missing post ID`);
  }
}

export async function restaurantFormAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (request.method === "PUT") {
    let formData = await request.formData();
    const restaurant = Object.fromEntries(
      formData
    ) as unknown as RestaurantData;
    restaurant._id = params.restaurantId!;
    console.log("restaurant", restaurant);

    await updateRestaurant(restaurant);
    return redirect(`/restaurants/`);
  }
}

export async function restaurantFormAddDishAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (request.method === "POST") {
    let formData = await request.formData();
    const dish = Object.fromEntries(formData) as unknown as DishData;
    dish.ratings = [];
    dish.restaurant_id = params.restaurantId!;
    console.log("dish", dish);

    await addDishToRestaurant(dish);
    return redirect(`/restaurants/${dish.restaurant_id}/menu`);
  }
}

export async function restaurantApplyForJobAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (request.method === "POST") {
    let formData = await request.formData();
    const jobApplication = Object.fromEntries(
      formData
    ) as unknown as ApplyForJobMessage;
    const restaurant_id = params.restaurantId!;
    jobApplication.restaurant_id = params.restaurantId!;

    console.log("jobApplication", jobApplication);

    await applyForJobToRestaurant(jobApplication);
    return redirect(`/restaurants/${restaurant_id}/`);
  }
}

async function updateRestaurant(restaurant: RestaurantData) {
  console.log(restaurant._id);
  fetch(`http://localhost:8080/restaurants/${restaurant._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(restaurant),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update restaurant");
      }
      console.log("Restaurant updated successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating restaurant:", error);
    });
}

async function addDishToRestaurant(dish: DishData) {
  fetch(
    `http://localhost:8080/restaurants/${dish.restaurant_id}/add-dish-to-restautant`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dish),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add dish to restaurant ");
      }
      console.log("Dish added to restaurant successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding dish to restaurant:", error);
    });
}
export async function addRatingToRestaurant(
  restaurant_id: string,
  rating: string
) {
  fetch(`http://localhost:8080/restaurants/${restaurant_id}/rate-restaurant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ rating }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add rating to restaurant ");
      }
      console.log("Rating added to restaurant successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding rating to restaurant:", error);
    });
}

async function applyForJobToRestaurant(jobApplication: ApplyForJobMessage) {
  console.log("jobApplication", jobApplication);

  fetch(
    `http://localhost:8080/restaurants/${jobApplication.restaurant_id}/apply-for-job`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(jobApplication),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add jobApplication for restaurant ");
      }
      console.log("JobApplication added tforo restaurant successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding jobApplication for restaurant:", error);
    });
}

async function deleteRestaurantById(restaurantId: string) {
  fetch(`http://localhost:8080/restaurants/${restaurantId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }
      console.log("Restaurant deleted successfully");
      alert("You have applied for job successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting restaurant:", error);
    });
}

export async function restaurantAction({
  request,
  params,
}: ActionFunctionArgs) {
  const url = new URL(request.url);
  console.log("URLLL", url);
  if (request.method === "DELETE") {
    params.restaurantId && (await deleteRestaurantById(params.restaurantId));

    return redirect("/restaurants");
  } else if (request.method === "PUT") {
    return redirect(`/restaurants/${params.restaurantId}/edit`);
  } else if (request.method === "POST") {
    return redirect(`/restaurants/${params.restaurantId}/apply-for-job`);
  } else {
    return redirect(`/restaurants/${params.restaurant_id}/menu`);
  }
}
export async function menuAction({ request, params }: ActionFunctionArgs) {
  if (request.method === "PUT") {
    console.log("nigga");
    return redirect(`/dishes/${params.dishId}/edit`);
  }
}
