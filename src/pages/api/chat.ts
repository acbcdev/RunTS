import type { APIRoute } from "astro";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();

  const result = streamText({
    messages,

    model: google("gemini-2.0-flash-exp"),
    temperature: 0.4,
  });
  return result.toDataStreamResponse();
};
