import type { SVGProps } from "react";
import pg from "@/../package.json";
import { claude } from "../svg/claude";
import { gemini } from "../svg/gemini";
import mistral from "../svg/mistral";
import { openai } from "../svg/openai";
// Define types locally since types.ts is empty
export type model = {
  id: string;
  name: string;
};

export type providers = "openai" | "google" | "anthropic" | "mistral";
export type Provider = { name: providers; url: string };
export const versionApp = pg.version;

export const API_PROVIDERS: Provider[] = [
  { name: "openai", url: "https://platform.openai.com/api-keys" },
  { name: "google", url: "https://aistudio.google.com/apikey" },
  { name: "anthropic", url: "https://console.anthropic.com/settings/keys" },
  {
    name: "mistral",
    url: "https://console.mistral.ai/api-keys",
  },
];

export const MESSAGE_LOG = `

		Open to Contributors 🌐

		repo:	https://github.com/acbcdev/Runts
		author:	https://acbc.dev
		license:	Apache-2.0

		This is a JavaScript/TypeScript code runner.

			`;

type providerType = "openai" | "google" | "anthropic" | "mistral";

const providers: Record<
  providerType,
  {
    models: model[];
    active: boolean;
    Icon: React.FC<SVGProps<SVGSVGElement>>;
  }
> = {
  openai: {
    models: [
      { id: "gpt-5-mini", name: "GPT-5 mini" },
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-nano", name: "GPT-5 nano" },
    ],
    active: true,
    Icon: openai,
  },
  google: {
    models: [
      { id: "gemma-3-12b-it", name: "Gemma 3 12b " },
      { id: "gemma-3-27b-it", name: "Gemma 3 27b " },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    ],
    active: true,
    Icon: gemini,
  },
  anthropic: {
    models: [
      { id: "claude-3-sonnet-20240229", name: "Claude Sonnet 3 " },
      { id: "claude-3-5-haiku-latest", name: "Claude Haiku 3.5 " },
      { id: "claude-3-7-sonnet-20250219", name: "Claude Sonnet 3.7" },
      { id: "claude-opus-4-20250514", name: "Claude Opus 4" },
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
    ],
    active: true,
    Icon: claude,
  },
  mistral: {
    models: [
      { id: "mistral-large-latest", name: "mistral large" },
      { id: "pixtral-large-latest", name: "pixtral large" },
      { id: "mistral-small-latest", name: "mistral small" },
    ],
    active: true,
    Icon: mistral,
  },
};

export const models = Object.entries(providers)
  .flatMap(([provider, value]) =>
    value.models.map((model) => ({
      provider,
      ...model,
      active: value.active,
      Icon: value.Icon,
    }))
  )
  .filter((models) => models.active);

export interface EditorBehaviorOption {
  label: string;
  value?: boolean;
  description: string;
}
