"use server";

import { sql } from "@vercel/postgres";

interface MessageContent {
  timestamp: string;
  chat_id: string;
  channel_name: string;
  sender_alias: string;
  message: string;
}

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file uploaded" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const content: MessageContent[] = JSON.parse(buffer.toString("utf-8"));

    if (!Array.isArray(content)) {
      return { error: "JSON must be an array of messages" };
    }

    let successCount = 0;
    const errors: string[] = [];

    for (const message of content) {
      if (!message.timestamp || 
          !message.chat_id || 
          !message.channel_name || 
          !message.sender_alias || 
          !message.message) {
        errors.push(`Invalid message at timestamp ${message.timestamp || 'unknown'}: missing fields`);
        continue;
      }

      try {
        await sql`
          INSERT INTO messages (timestamp, chat_id, channel_name, sender_alias, message)
          VALUES ($1, $2, $3, $4, $5)
        `.values([
          message.timestamp,
          message.chat_id,
          message.channel_name,
          message.sender_alias,
          message.message
        ]);
        successCount++;
      } catch (dbError) {
        errors.push(`Failed to insert message at timestamp ${message.timestamp}: ${dbError}`);
      }
    }

    if (successCount === content.length) {
      return { success: true, count: successCount };
    } else {
      return { 
        success: false,
        count: successCount,
        errors: errors
      };
    }

  } catch (error) {
    console.error("Failed to process upload:", error);
    return { 
      error: "Failed to process file",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}
