import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import path from "node:path";
import cloudflare from "@astrojs/cloudflare";
import AstroPWA from "@vite-pwa/astro";
export default defineConfig({
  site: "https://runts.acbc.dev",
  integrations: [
    react(),
    tailwind(),
    AstroPWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      manifest: {
        name: "Runts",
        short_name: "Runts",
        description: "Typescript playground with themes ",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  devToolbar: {
    enabled: false,
  },

  output: "server",

  vite: {
    resolve: {
      alias: {
        "@core": path.resolve("../core/src"),
        "@/web": "./src",
      },
    },
  },

  adapter: cloudflare(),
});

//    VitePWA({
//               registerType: "autoUpdate",
//               strategies: "generateSW",
//               manifest: {
//                   name: "Runts",
//                   short_name: "Runts",
//                   description: "Typescript playground with themes ",
//                   theme_color: "#000000",
//                   icons: [
//                       {
//                           src: "/icons/pwa-512x512.png",
//                           sizes: "512x512",
//                           type: "image/png",
//                           purpose: "any",
//                       },
//                       {
//                           src: "/icons/pwa-192x192.png",
//                           sizes: "192x192",
//                           type: "image/png",
//                           purpose: "any",
//                       },
//                       {
//                           src: "/icons/pwa-maskable-192x192.png",
//                           sizes: "192x192",
//                           type: "image/png",
//                           purpose: "maskable",
//                       },
//                       {
//                           src: "/icons/pwa-maskable-512x512.png",
//                           sizes: "512x512",
//                           type: "image/png",
//                           purpose: "maskable",
//                       },
//                   ],
//               },
//               devOptions: {
//                   enabled: true,
//               },
//               workbox: {
//                   maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
//                   globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
//                   cleanupOutdatedCaches: true,
//               },
//           }),
