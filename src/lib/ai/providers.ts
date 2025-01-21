import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { providers } from "@/types/ai";
const generativeAIProviders = {
  openai: createOpenAI,
  google: createGoogleGenerativeAI,
  anthropic: createAnthropic,
};
export function createProvider(provider: providers, apiKey: string) {
  return generativeAIProviders[provider]({ apiKey });
}
// openai("gpt-4o-2024-11-20");
// openai("gpt-4o-mini-2024-07-18");
// openai("o1-mini-2024-09-12");
// openai("o1-2024-12-17");

// anthropic("claude-3-sonnet-20240229");
// anthropic("claude-3-5-haiku-latest");

// google("gemini-2.0-flash-exp");
// google("gemini-1.5-pro-latest");
// google("gemini-1.5-flash-latest");

// const providersList: GoogleGenerativeAIModelId[] = [
//   // {
//   //   name: "openai",
//   //   models: [
//   //     "gpt-4o-2024-11-20",
//   //     "gpt-4o-mini-2024-07-18",
//   //     "o1-mini-2024-09-12",
//   //     "o1-2024-12-17",
//   //   ],
//   // },
//   // {
//   //   name: "anthropic",
//   //   models: ["claude-3-sonnet-20240229", "claude-3-5-haiku-latest"],
//   // },
//   // {
//   //   name: "google",
//   //   models: [
//   //     "gemini-2.0-flash-exp",
//   //     "gemini-1.5-pro-latest",
//   //     "gemini-1.5-flash-latest",
//   //   ],
//   // },
// ];
