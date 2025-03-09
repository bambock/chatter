import { sql } from "@vercel/postgres";

export default async function MessagesPage() {
  // Fetch messages from the database
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC`;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Messages</h1>
      {rows.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Chat ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sender</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(row.timestamp).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.chatid}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.sender}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
