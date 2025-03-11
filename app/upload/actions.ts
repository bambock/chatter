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

  if (!file.type.includes("json")) {
    return { error: "Only JSON files are supported" };
  }
  if (file.size > 1024 * 1024) {
    return { error: "File too large (max 1MB)" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const content: MessageContent[] = JSON.parse(buffer.toString("utf-8"));

    if (!Array.isArray(content)) {
      return { error: "JSON must be an array of messages" };
    }

    // Validate all messages first
    for (const message of content) {
      if (
        !message.timestamp ||
        !message.chat_id ||
        !message.channel_name ||
        !message.sender_alias ||
        !message.message
      ) {
        return {
          error: `Invalid message format in array at timestamp: ${message.timestamp || "unknown"}`,
          details: "Missing required fields",
        };
      }
    }

    // Insert each message
    for (const message of content) {
      await sql`
        INSERT INTO messages (timestamp, chat_id, channel_name, sender_alias, message)
        VALUES (${message.timestamp}, ${message.chat_id}, ${message.channel_name}, ${message.sender_alias}, ${message.message})
      `;
    }

    return {
      success: true,
      count: content.length,
    };
  } catch (error) {
    console.error("Failed to process upload:", error);
    return {
      error: "Failed to process file or store data",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
