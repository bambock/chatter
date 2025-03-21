"use server";

import { sql } from "@vercel/postgres";
// import formidable from "formidable";
// import { readFileSync } from "fs";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file uploaded" };
  }

  // Parse the file (assuming it’s JSON)
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = JSON.parse(buffer.toString("utf-8"));

    /*
     {
      "timestamp": "2023-09-18T17:49:52.000Z",
      "chat_id": "!RMdGGuCKLBreGJPwlH",
      "channel_name":"matrix.bestflowers247.online",
      "sender_alias": "@usernamess",
      "message": "!\n"
    },
      */
    // Validate the content structure
    if (
      !content.timestamp ||
      !content.chat_id ||
      !content.channel_name ||
      !content.sender_alias ||
      !content.message
    ) {
      return { error: "File missing required fields" };
    }

    // Insert into database
    await sql`
      INSERT INTO messages (timestamp, chat_id, channel_name, sender_alias, message)
      VALUES (${content.timestamp}, ${content.chat_id}, ${content.channel_name}, ${content.sender_alias}, ${content.message})
    `;

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to process file or store data" };
  }
}
