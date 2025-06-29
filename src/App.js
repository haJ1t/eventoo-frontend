import React, { useEffect, useState } from "react";
import { fetchEvents, fetchUsers } from "./api/api";

function App() {
  const [eventMessage, setEventMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const eventData = await fetchEvents();
      const userData = await fetchUsers();

      setEventMessage(eventData?.message || "No event data");
      setUserMessage(userData?.message || "No user data");
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Evento Frontend</h1>
      <p>Events API says: {eventMessage}</p>
      <p>Users API says: {userMessage}</p>
    </div>
  );
}

export default App;
