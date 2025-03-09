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
            {rows.map((row) => (
              <div key={row.id}>
                <p>
                  {new Date(row.timestamp).toLocaleString()}
                </p>
                <p className="text-red-300">{row.chatid}</p>
                <p className="text-red-300">{row.sender}</p>
                <p className="text-red-300">{row.message}</p>
              </div>
            ))}
      )}
    </div>
  );
}
