import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import { UserData, getUsers } from "./users-service";

export interface RecepieData {
  id: string;
  creatorId: string | null;
  name: string;
  briefDescription: string;
  prepareTime: number;
  products: string[];
  image: string;
  bigDescription: string;
  keywords: string[];
  postDate: string;
  latestModification: string;
}

export interface RecepiesData {
  recepies: RecepieData[];
  authors: UserData[];
}

export interface RecepieErrors {
  name?: string;
  briefDescription?: string;
  prepareTime?: string;
  products?: string;
  image?: string;
  bigDescription?: string;
  keywords?: string;
  postDate?: string;
  latestModification?: string;
  conclude?: string;
}

export interface RecepieActionResult {
  errors: RecepieErrors;
  values: RecepieData;
}

export async function getRecepies() {
  try {
    const response = await fetch("http://localhost:8000/recepies");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const recepies: RecepieData[] = await response.json();
    return { recepies: recepies, authors: (await getUsers()).users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { recepies: [], authors: [] };
  }
}

export async function getRecepieById(id: string) {
  const data: RecepiesData = await getRecepies();
  return data.recepies.find((r) => r.id === id);
}

export async function getRecepieByUserId(creatorId: string) {
  const data: RecepiesData = await getRecepies();
  return data.recepies.find((r) => r.creatorId === creatorId);
}

async function deleteRecepieById(recepieId: string) {
  fetch(`http://localhost:8000/recepies/${recepieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete recepie");
      }
      console.log("Recepie deleted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting recepie:", error);
    });
}

export async function recepieLoader({ request, params }: LoaderFunctionArgs) {
  const data: RecepiesData = await getRecepies();
  if (
    params.recepieId &&
    data.recepies.some((r) => r.id === params?.recepieId)
  ) {
    return getRecepieById(params.recepieId);
  } else {
    throw new Error(`Invalid or missing post ID`);
  }
}

export async function recepieAction({ request, params }: ActionFunctionArgs) {
  if (request.method === "DELETE") {
    params.recepieId && (await deleteRecepieById(params.recepieId));

    return redirect("/recepies");
  } else if (request.method === "PUT") {
    return redirect(`/recepies/${params.recepieId}/edit`);
  }
}

async function updateRecepie(recepie: RecepieData) {
  fetch(`http://localhost:8000/recepies/${recepie.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recepie),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update recepie");
      }
      console.log("Recepie updated successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating recepie:", error);
    });
}

export async function recepieFormAction({
  request,
  params,
}: ActionFunctionArgs) {
  const errors: RecepieErrors = {};
  if (request.method === "PUT") {
    let formData = await request.formData();
    const recepie = Object.fromEntries(formData) as unknown as RecepieData;
    recepie.id = params.recepieId!;
    console.log(recepie);

    if (recepie.name === "" || recepie.prepareTime === 0) {
      errors.conclude =
        "Error. Recepie name and prepare time fields must be filled .";
    }

    if (recepie.name.length > 80) {
      errors.name =
        "Error. Recepie name length is over the limit of 80 characters.";
    }

    if (recepie.briefDescription.length > 256) {
      errors.briefDescription =
        "Error. Brief description length is must be under of 256 characters.";
    }

    if (recepie.prepareTime <= 0) {
      errors.prepareTime =
        "Error. Prepare time can not be negative number or 0.";
    }

    if (recepie.bigDescription.length > 2048) {
      errors.bigDescription =
        "Error. Big description length is must be under of 2048 characters.";
    }

    if (Object.keys(errors).length) {
      return { errors, values: recepie };
    }

    await updateRecepie(recepie);
    return redirect(`/recepies/`);
  }
}
