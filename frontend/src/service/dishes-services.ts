import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";

export interface DishData {
  _id: string;
  restaurant_id: string;
  name: string;
  image: string;
  description: string;
  ratings: number[];
  price: number;
  estimated_time: number;
}
export interface DishErrors {
  name?: string;
  image?: string;
  description?: string;
  price?: number;
  estimated_time?: number;
}

export interface DishesData {
  dishes: DishData[];
}

export interface DishActionResult {
  errors: DishErrors;
  values: DishData;
}

export async function addRatingToDish(dish_id: string, rating: string) {
  fetch(`http://localhost:8080/dishes/${dish_id}/rate-dish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ rating }),
  })
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
export async function deleteDish(dishId: string, restaurantId: string) {
  fetch(
    `http://localhost:8080/restaurants/${restaurantId}/dishes/${dishId}/delete-dish-from-restautant`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete dish from restaurant ");
      }
      console.log("Dish deleted from restaurant successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting dish from restaurant:", error);
    });
}

export async function getDishes() {
  try {
    const response = await fetch("http://localhost:8080/dishes", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const dishes: DishData[] = await response.json();
    return { dishes: dishes };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { dishes: [] };
  }
}

export async function getDishById(id: string) {
  const data: DishesData = await getDishes();
  return data.dishes.find((d) => d._id === id);
}

export async function dishLoader({ request, params }: LoaderFunctionArgs) {
  const data: DishesData = await getDishes();
  if (params.dishId && data.dishes.some((d) => d._id === params?.dishId)) {
    return getDishById(params.dishId);
  } else {
    throw new Error(`Invalid or missing post ID`);
  }
}

async function updateDish(dish: DishData) {
  console.log(dish._id);
  fetch(
    `http://localhost:8080/restaurants/${dish.restaurant_id}/dishes/${dish._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dish),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update dish");
      }
      console.log("Dish updated successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating dish:", error);
    });
}

export async function dishFormAction({ request, params }: ActionFunctionArgs) {
  if (request.method === "PUT") {
    let formData = await request.formData();
    const dish = Object.fromEntries(formData) as unknown as DishData;
    dish._id = params.dishId!;
    console.log("dish", dish);

    await updateDish(dish);
    return redirect(`/restaurants/${dish.restaurant_id}/menu`);
  }
}
