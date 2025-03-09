import { QueryResultRow, sql } from "@vercel/postgres";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MessagesPage() {
  // Fetch messages from the database
  const { rows } = await sql`SELECT * FROM messages ORDER BY timestamp DESC`;

  return (
    <div className="m-4">
      <h1>Chat Messages</h1>
      {rows.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="mt-4">
          {rows.map((row: QueryResultRow) => (
            <Card key={row.id} className="m-3 bg-gray-300">
              <CardHeader>
                <CardTitle>
                  {new Date(row.timestamp).toLocaleString()}
                </CardTitle>
                <CardDescription>Message {row.chatid}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-300">{row.sender}</p>
                <p className="text-red-300">{row.message}</p>
              </CardContent>
              <CardFooter>EOF</CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
