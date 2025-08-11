import type { JSX, SVGProps } from "react";

export type providers = "openai" | "google" | "anthropic" | "mistral";
type model = {
  id: string;
  name: string;
};
export type ProviderItem = {
  name: providers;
  models: model[];
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};
