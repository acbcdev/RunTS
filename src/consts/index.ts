import { claude } from "@/svg/claude";
import { gemini } from "@/svg/gemini";
import { openai } from "@/svg/openai";
import type { ProviderItem } from "@/types/ai";

export const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export const refreshTimes = [
  { value: null, time: "off" },
  { value: 100, time: "100ms" },
  { value: 200, time: "200ms" },
  { value: 400, time: "400ms" },
  { value: 500, time: "500ms" },
  { value: 700, time: "700ms" },
  { value: 800, time: "800ms" },

  { value: 1000, time: "1s" },
  { value: 2000, time: "2s" },
  { value: 3000, time: "3s" },
];
export const fontFamilies = [
  { name: "Cascadia Code", value: '"Cascadia Code"' },
  { name: "Fira Code", value: '"Fira Code"' },
  { name: "Monocraft", value: "Monocraft" },
];
type TLayout = "vertical" | "horizontal";
export const layouts: TLayout[] = ["vertical", "horizontal"];

export const providersList: ProviderItem[] = [
  {
    name: "openai",
    models: [
      "gpt-4o-2024-11-20",
      "gpt-4o-mini-2024-07-18",
      "o1-mini-2024-09-12",
      "o1-2024-12-17",
    ],
    Icon: openai,
  },
  {
    name: "anthropic",
    models: ["claude-3-sonnet-20240229", "claude-3-5-haiku-latest"],
    Icon: claude,
  },
  {
    name: "google",
    models: [
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
    ],
    Icon: gemini,
  },
];
