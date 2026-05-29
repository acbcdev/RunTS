import type { anthropic as anthropicProvider } from "@ai-sdk/anthropic";
import type { google as googleProvider } from "@ai-sdk/google";
import type { mistral as mistralProvider } from "@ai-sdk/mistral";
import type { openai as openaiProvider } from "@ai-sdk/openai";
import type { JSX, SVGProps } from "react";
import { claude, gemini, mistral, openai } from "@/features/common/svg/";

export type OpenAIModelId = Parameters<typeof openaiProvider>[0];
export type AnthropicModelId = Parameters<typeof anthropicProvider>[0];
export type GoogleModelId = Parameters<typeof googleProvider>[0];
export type MistralModelId = Parameters<typeof mistralProvider>[0];

type supportedModelIds =
  | OpenAIModelId
  | AnthropicModelId
  | GoogleModelId
  | MistralModelId;

type ModelConfigEntry = {
  id: supportedModelIds;
  name: string;
};

type ProvidersConfig = {
  name: string;
  apiKeyUrl: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  models: ModelConfigEntry[];
};

type ProvidersConfigMap = Record<string, ProvidersConfig>;

export const PROVIDER_CONFIG: ProvidersConfigMap = {
  openai: {
    name: "OpenAI",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    icon: openai,
    models: [
      { id: "gpt-5.4", name: "GPT-5.4" },
      { id: "gpt-5.4-mini", name: "GPT-5.4 Mini" },
      { id: "gpt-5.4-codex", name: "GPT-5.4 Codex" },
      { id: "gpt-5.4-nano", name: "GPT-5.4 Nano" },
      { id: "gpt-5.4-pro", name: "GPT-5.4 Pro" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    icon: claude,
    models: [
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
      { id: "claude-opus-4-7", name: "Claude Opus 4.7" },
    ],
  },
  google: {
    name: "Google",
    apiKeyUrl: "https://aistudio.google.com/apikey",
    icon: gemini,
    models: [
      // { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      // { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      // { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemma-3-27b-it", name: "Gemma 3.27B" },
      { id: "gemma-3-8b-it", name: "Gemma 3.8B" },
      { id: "gemini-flash-latest", name: "Gemini Flash Latest" },
      { id: "gemini-pro-latest", name: "Gemini Pro Latest" },
      { id: "gemini-flash-lite-latest", name: "Gemini Flash Lite Latest" },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash" },
    ],
  },
  mistral: {
    name: "Mistral",
    apiKeyUrl: "https://console.mistral.ai/api-keys",
    icon: mistral,
    models: [
      { id: "mistral-large-latest", name: "Mistral Large" },
      { id: "mistral-small-latest", name: "Mistral Small" },
      { id: "pixtral-large-latest", name: "Pixtral Large" },
    ],
  },
} satisfies Record<string, ProvidersConfig>;
