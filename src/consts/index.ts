import pg from "@/../package.json";
import type { Radius } from "@/store/apparence";
import { claude } from "@/svg/claude";
import { gemini } from "@/svg/gemini";
import mistral from "@/svg/mistral";
import { openai } from "@/svg/openai";
import type { ProviderItem } from "@/types/ai";
import type { lineRendererEditor } from "@/types/editor";
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
export const radiuses: Radius[] = ["0", "0.3", "0.5", "0.8", "1"];

export const providersList: ProviderItem[] = [
  {
    name: "openai",
    models: [
      // "gpt-4o-mini-2024-07-18",
      // "gpt-4o-mini-search-preview",
      // "gpt-4o-2024-11-20",
      // "gpt-4o-search-preview",
      // "gpt-4.1-nano",
      // "gpt-4.1-mini",
      // "gpt-4.5-preview",
      // "gpt-4.5-preview-2025-02-27",
      // "o1-mini-2024-09-12",
      // "o1-2024-12-17",
      // "03",
      // "o3-mini",
      // "o4-mini",
      { id: "gpt-5-mini", name: "GPT-5 mini" },
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-nano", name: "GPT-5 nano" },
    ],
    Icon: openai,
  },
  {
    name: "anthropic",
    models: [
      { id: "claude-3-sonnet-20240229", name: "Claude Sonnet 3 " },
      { id: "claude-3-5-haiku-latest", name: "Claude Haiku 3.5 " },
      { id: "claude-3-7-sonnet-20250219", name: "Claude Sonnet 3.7" },
      { id: "claude-opus-4-20250514", name: "Claude Opus 4" },
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
    ],
    Icon: claude,
  },
  {
    name: "google",
    models: [
      { id: "gemma-3-12b-it", name: "Gemma 3 12b " },
      { id: "gemma-3-27b-it", name: "Gemma 3 27b " },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    ],
    Icon: gemini,
  },

  {
    name: "mistral",
    models: [
      { id: "mistral-large-latest", name: "mistral large" },
      { id: "pixtral-large-latest", name: "pixtral large" },
      { id: "mistral-small-latest", name: "mistral small" },
    ],
    Icon: mistral,
  },
];
export interface EditorBehaviorOption {
  label: string;
  value?: boolean;
  description: string;
}
