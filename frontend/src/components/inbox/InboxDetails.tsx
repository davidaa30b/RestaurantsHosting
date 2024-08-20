import { Form, useLoaderData, useNavigate } from "react-router-dom";
import "../../css/Inboxes.css";
import { InboxData } from "../../service/inboxes-services";
import { useEffect, useState } from "react";
import { getUserById } from "../../service/users-service";
import { getStaffMemberByEmail } from "../../service/staff-services";
import { formatDate } from "../../help_functions/formatDates";

type Props = {};

const InboxDetails = (props: Props) => {
  let inbox = useLoaderData() as InboxData;
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [canApprove, setCanApprove] = useState<Record<string, boolean>>({});
  const [profilePics, setProfilePics] = useState<Record<string, string>>({});
  const [canApplyManager, setCanApplyManager] = useState<
    Record<string, boolean>
  >({});

  const curRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchUserNames = async () => {
      const namesMap: Record<string, string> = {};
      const canApproveMap: Record<string, boolean> = {};
      const canApplyManager: Record<string, boolean> = {};
      const profilePics: Record<string, string> = {};

      if (!namesMap[inbox.sender_id]) {
        const sender = await getUserById(inbox.sender_id);
        if (sender) {
          namesMap[inbox.sender_id] = `${sender.firstName} ${sender.lastName}`;
          const staff = await getStaffMemberByEmail(sender.email);
          canApproveMap[inbox.sender_id] = !staff;
          canApplyManager[inbox.sender_id] = sender.role !== "manager";
          if (sender.image) {
            profilePics[inbox.sender_id] = sender.image;
          }
        }
      }

      if (!namesMap[inbox.recipient_id]) {
        const recipient = await getUserById(inbox.recipient_id);
        if (recipient) {
          namesMap[
            inbox.recipient_id
          ] = `${recipient.firstName} ${recipient.lastName}`;
          if (recipient.image) {
            profilePics[inbox.recipient_id] = recipient.image;
          }
        }
      }

      console.log("canApplyManager", canApplyManager);
      setUserNames(namesMap);
      setCanApprove(canApproveMap);
      setCanApplyManager(canApplyManager);
      setProfilePics(profilePics);
    };

    fetchUserNames();
  }, [inbox]);

  return (
    <div className="inbox-details-container">
      <h4>Message Details</h4>
      <div>
        <img src={profilePics[inbox.sender_id]} />

        <span>Sender:</span>
        <span>{userNames[inbox.sender_id]}</span>
        <span>, {inbox.sender_type}</span>
      </div>
      <div>
        <img src={profilePics[inbox.recipient_id]} />
        <span>Recipient:</span>
        <span>{userNames[inbox.recipient_id]}</span>
        <span>, {inbox.recipient_type}</span>
      </div>
      <div>
        <span>Theme:</span>
        <span>{inbox.type}</span>
      </div>
      <div>
        <span>Message:</span>
        <span>{inbox.message}</span>
      </div>
      <div>
        <span>Date sent:</span>
        <span>{formatDate(inbox.created_at)}</span>
      </div>

      <div className="restaurant-actions">
        {inbox.type === "managerApplication" &&
          inbox.recipient_type === "Admin" &&
          curRole === "admin" &&
          canApplyManager[inbox.sender_id] && (
            <Form method="POST">
              <button type="submit">Apply</button>
            </Form>
          )}

        {inbox.type === "jobApplication" &&
          curRole === "manager" &&
          canApprove[inbox.sender_id] &&
          inbox.sender_type !== "Manager" && (
            <Form
              method="post"
              action={`/inboxes/${inbox._id}/approve-job-application/${true}`}
            >
              <button type="submit">Approve</button>
            </Form>
          )}
        {inbox.type === "jobApplication" &&
          curRole === "manager" &&
          canApprove[inbox.sender_id] &&
          inbox.sender_type !== "Manager" && (
            <Form
              method="post"
              action={`/inboxes/${inbox._id}/approve-job-application/${false}`}
            >
              <button type="submit">Refuse</button>
            </Form>
          )}

        <Form
          method="DELETE"
          onSubmit={(event) => {
            // eslint-disable-next-line no-restricted-globals
            if (!confirm("Please confirm you want to delete this record.")) {
              event.preventDefault();
            }
          }}
        >
          <button id="delete-button" type="submit">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
};

export default InboxDetails;
