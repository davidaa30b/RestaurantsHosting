import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { InboxData, InboxesData } from "../../service/inboxes-services";
import { useEffect, useState } from "react";
import { getUserById } from "../../service/users-service";
import "../../css/Inboxes.css";
import "../../css/GoBackButton.css";
import { formatDate } from "../../help_functions/formatDates";

const Inboxes = () => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const { inboxes } = useLoaderData() as InboxesData;
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState<"sent" | "received" | "all">(
    "all"
  );
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [myInboxes, setMyInboxes] = useState(
    inboxes.filter(
      (i) => i.recipient_id === currentUserId || i.sender_id === currentUserId
    )
  );
  const [selectedInbox, setSelectedInbox] = useState<InboxData | null>(null);

  useEffect(() => {
    const fetchUserNames = async () => {
      const namesMap: Record<string, string> = {};
      for (const inbox of inboxes) {
        if (!namesMap[inbox.sender_id]) {
          const sender = await getUserById(inbox.sender_id);
          if (sender) {
            namesMap[
              inbox.sender_id
            ] = `${sender.firstName} ${sender.lastName}`;
          }
        }
        if (!namesMap[inbox.recipient_id]) {
          const recipient = await getUserById(inbox.recipient_id);
          if (recipient) {
            namesMap[
              inbox.recipient_id
            ] = `${recipient.firstName} ${recipient.lastName}`;
          }
        }
      }
      setUserNames(namesMap);
    };
    fetchUserNames();
  }, [inboxes]);

  useEffect(() => {
    let filteredInboxes = inboxes;
    if (filterType === "sent") {
      filteredInboxes = filteredInboxes.filter(
        (i) => i.sender_id === currentUserId
      );
    } else if (filterType === "received") {
      filteredInboxes = filteredInboxes.filter(
        (i) => i.recipient_id === currentUserId
      );
    } else {
      filteredInboxes = filteredInboxes.filter(
        (i) => i.recipient_id === currentUserId || i.sender_id === currentUserId
      );
    }
    if (selectedTheme !== "all") {
      filteredInboxes = filteredInboxes.filter((i) => i.type === selectedTheme);
    }
    filteredInboxes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setMyInboxes(filteredInboxes);
  }, [filterType, selectedTheme, sortOrder, inboxes, currentUserId]);

  return (
    <div className="inboxes-container">
      <aside className="inboxes-sidebar">
        <h2>Navigation</h2>

        <div className="inboxes-filter">
          <button
            className={`filter-button ${filterType === "sent" ? "active" : ""}`}
            onClick={() => setFilterType("sent")}
          >
            <span className="icon">📤</span> Sent
          </button>
          <button
            className={`filter-button ${
              filterType === "received" ? "active" : ""
            }`}
            onClick={() => setFilterType("received")}
          >
            <span className="icon">📥</span> Received
          </button>
          <button
            className={`filter-button ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            <span className="icon">📬</span> All
          </button>
        </div>
        <div className="inboxes-settings">
          <h3>Filter by</h3>
          <div className="inboxes-settings-item">
            <label>
              Theme:
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="all">All</option>
                <option value="managerApplication">Manager Application</option>
                <option value="jobApplication">Job Application</option>
              </select>
            </label>
          </div>
          <div className="inboxes-settings-item">
            <label>
              Date:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <button className="go-back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button
            className="go-back-button"
            onClick={() => setSelectedInbox(null)}
          >
            Clear
          </button>
        </div>
      </aside>
      <main className="inboxes-main">
        <div className="inboxes-list">
          <h1>Inbox</h1>

          {myInboxes.length ? (
            myInboxes.map((i) => (
              <div
                key={i._id}
                className={`inbox-item ${
                  selectedInbox?._id === i._id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedInbox(i);
                  navigate("/inboxes/" + i._id);
                }}
              >
                <div className="inbox-item-header">
                  <span className="inbox-item-characteristic">
                    <strong>Sender:</strong> {userNames[i.sender_id]}
                  </span>
                  <span className="inbox-item-characteristic">
                    <strong>Recipient:</strong> {userNames[i.recipient_id]}
                  </span>
                </div>
                <div className="inbox-item-body">
                  <span className="inbox-item-characteristic">
                    <strong>Theme:</strong> {i.type}
                  </span>
                  <span className="inbox-item-characteristic">
                    <strong>Date:</strong> {formatDate(i.created_at)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No messages found.</p>
          )}
        </div>
        {selectedInbox && (
          <div className="sticky-outlet">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Inboxes;
