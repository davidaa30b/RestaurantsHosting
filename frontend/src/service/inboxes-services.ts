import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";

export interface ApplyForJobMessage {
  restaurant_id: string;
  message: string;
  position: string;
}

export interface InboxesData {
  inboxes: InboxData[];
}

export interface InboxData {
  _id: string;
  sender_id: string;
  sender_type: string;
  recipient_id: string;
  recipient_type: string;
  message: string;
  type: string;
  position: string;
  restaurant_id: string;
  created_at: string;
}

interface ReplayInbox {
  inboxId: string;
  approve: boolean;
  message: string;
}

export async function getInboxes() {
  try {
    const response = await fetch("http://localhost:8080/inboxes", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const inboxes: InboxData[] = await response.json();
    return { inboxes: inboxes };
  } catch (error) {
    console.error("Error fetching inboxes:", error);
    return { inboxes: [] };
  }
}

export async function getInboxById(id: string) {
  const data: InboxesData = await getInboxes();
  return data.inboxes.find((c) => c._id === id);
}

export async function inboxLoader({ request, params }: LoaderFunctionArgs) {
  const data: InboxesData = await getInboxes();
  if (params.inboxId && data.inboxes.some((c) => c._id === params?.inboxId)) {
    return getInboxById(params.inboxId);
  } else {
    throw new Error(`Invalid or missing post ID`);
  }
}

async function deleteInboxById(inboxId: string) {
  fetch(`http://localhost:8080/inboxes/${inboxId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete inbox");
      }
      console.log("Inbox deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting inbox:", error);
    });
}

export async function inboxAction({ request, params }: ActionFunctionArgs) {
  if (request.method === "DELETE") {
    params.inboxId && (await deleteInboxById(params.inboxId));
    return redirect("/inboxes");
  } else if (request.method === "POST") {
    return redirect(`/inboxes/${params.inboxId}/replay-manager-application`);
  }
}

async function managerApplicationReplay(replay: ReplayInbox) {
  console.log("replay.inboxId:", replay.inboxId);
  fetch(
    `http://localhost:8080/inboxes/${replay.inboxId}/approve-manager-application`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(replay),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to post managerApplicationReplay");
      }
      console.log("ManagerApplicationReplay posted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error posting managerApplicationReplay:", error);
    });
}
async function jobApplicationReplay(replay: ReplayInbox) {
  console.log("replay.inboxId:", replay.inboxId);
  fetch(
    `http://localhost:8080/inboxes/${replay.inboxId}/approve-job-application/${replay.approve}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(replay),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to post jobApplicationReplay");
      }
      console.log("JobApplicationReplay posted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error posting jobApplicationReplay:", error);
    });
}

export async function inboxFormReplayManagerApplicationAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (request.method === "POST") {
    let formData = await request.formData();

    const replay = Object.fromEntries(formData) as unknown as ReplayInbox;
    replay.inboxId = params.inboxId!;
    console.log("approve", params.approve!);

    console.log("here");
    await managerApplicationReplay(replay);
    return redirect(`/inboxes/`);
  }
}

export async function inboxApproveJobApplicationAction({
  request,
  params,
}: ActionFunctionArgs) {
  const replay = {} as ReplayInbox;
  replay.inboxId = params.inboxId!;
  const approve = params.approve! === "true" ? true : false;
  replay.approve = approve;
  await jobApplicationReplay(replay);
  return redirect(`/inboxes/`);
}
