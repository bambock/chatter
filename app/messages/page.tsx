import { QueryResultRow, sql } from "@vercel/postgres";

export default async function MessagesPage() {
  // Fetch messages from the database
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC`;

  return (
    <div className="m-4">
      <h1>Chat Messages</h1>
      {rows.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <>
          {rows.map((row: QueryResultRow) => (
            <div key={row.id}>
              <p>{new Date(row.timestamp).toLocaleString()}</p>
              <p className="text-red-300">{row.chatid}</p>
              <p className="text-red-300">{row.sender}</p>
              <p className="text-red-300">{row.message}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
