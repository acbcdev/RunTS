import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import path from "node:path";
// https://astro.build/config
export default defineConfig({
	site: "runts.acbc.dev",
	integrations: [react(), tailwind()],
	vite: {
		resolve: {
			alias: {
				"@core": path.resolve("../core/src"),
				"@/web": "./src",
			},
		},
	},
});
