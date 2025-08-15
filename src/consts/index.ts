import pg from "@/../package.json";
import { claude } from "@/svg/claude";
import { gemini } from "@/svg/gemini";
import mistral from "@/svg/mistral";
import { openai } from "@/svg/openai";
import type { Provider, model } from "@/types/ai";
import type { Radius } from "@/types/editor";
import type { lineRendererEditor } from "@/types/editor";
import type { SVGProps } from "react";
export const versionApp = pg.version;
export const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export const refreshTimes = [
  { value: 0, time: "off" },
  { value: 100, time: "100ms" },
  { value: 200, time: "200ms" },
  { value: 300, time: "300ms" },
  { value: 400, time: "400ms" },
  { value: 500, time: "500ms" },
  { value: 700, time: "700ms" },
  { value: 800, time: "800ms" },
  { value: 1000, time: "1s" },
  { value: 2000, time: "2s" },
  { value: 3000, time: "3s" },
];

export const renderLines: lineRendererEditor[] = [
  "none",
  "gutter",
  "line",
  "all",
];
export const fontFamilies = [
  { name: "Cascadia Code", value: '"Cascadia Code"' },
  { name: "Fira Code", value: '"Fira Code"' },
  { name: "Monocraft", value: "Monocraft" },
];
type TLayout = "vertical" | "horizontal";
export const layouts: TLayout[] = ["vertical", "horizontal"];
export const RADIUS_SIZES: Radius[] = [
  { display: "Sharp", size: "0" },
  { display: "Slight", size: "0.3" },
  { display: "Medium", size: "0.5" },
  { display: "Smooth", size: "0.75" },
  { display: "Curved", size: "1" },
];

export const API_PROVIDERS: Provider[] = [
  { name: "openai", url: "https://platform.openai.com/api-keys" },
  { name: "google", url: "https://aistudio.google.com/apikey" },
  { name: "anthropic", url: "https://console.anthropic.com/settings/keys" },
  {
    name: "mistral",
    url: "https://console.mistral.ai/api-keys",
  },
];

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
