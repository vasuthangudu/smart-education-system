import React, { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch messages from both APIs
    const fetchMessages = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get("http://localhost:5007/api/messages"),
          axios.get("http://localhost:5005/api/messages"),
        ]);

        // Combine both arrays
        const combinedMessages = [...res1.data, ...res2.data];

        // Filter messages where receiver is "Student"
        const studentMessages = combinedMessages.filter(
          (msg) => msg.receiver === "Student"
        );

        // Sort by date (newest first)
        studentMessages.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.dateTime);
          const dateB = new Date(b.createdAt || b.dateTime);
          return dateB - dateA;
        });

        setMessages(studentMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notifications for Student</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>From:</strong> {msg.sender}
              </p>
              <p>
                <strong>Subject:</strong> {msg.subject}
              </p>
              <p>{msg.message}</p>
              {msg.attachments && msg.attachments.length > 0 && (
                <div>
                  <strong>Attachments:</strong>
                  <ul>
                    {msg.attachments.map((att) => (
                      <li key={att._id}>
                        <a
                          href={`http://localhost:5007${att.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {att.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p>
                <small>
                  {new Date(msg.createdAt || msg.dateTime).toLocaleString()}
                </small>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
