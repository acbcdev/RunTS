import type { JSX, SVGProps } from "react";

export type providers = "openai" | "google" | "anthropic" | "mistral";
export type ProviderItem = {
	name: providers;
	models: string[];
	Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};
