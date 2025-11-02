import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      registerType: "prompt",
      injectRegister: "auto",
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
      // devOptions: {
      //   enabled: true,
      //   navigateFallbackAllowlist: [/^\//],
      // },
      workbox: {
        navigateFallback: "/",
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 8,
        globPatterns: ["**/*.{js,css,html,woff2}", "**/*.{png,jpg,svg,webp}"],
      },
    }),
    tailwindcss(),
  ],
  worker: {
    format: "es",
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@features": path.resolve("./src/features"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Monaco Editor - separate chunks
          "monaco-editor-core": ["monaco-editor"],
          "monaco-react": ["@monaco-editor/react"],

          // Prettier - separate chunk for formatting
          prettier: [
            "prettier/standalone",
            "prettier/plugins/typescript",
            "prettier/plugins/babel",
            "prettier/plugins/estree",
          ],

          // AI SDK - split by provider
          "ai-core": ["ai"],
          "ai-openai": ["@ai-sdk/openai"],
          "ai-anthropic": ["@ai-sdk/anthropic"],
          "ai-google": ["@ai-sdk/google"],
          "ai-mistral": ["@ai-sdk/mistral"],

          // React Markdown
          markdown: ["react-markdown", "remark-gfm"],

          // Motion animations
          motion: ["motion"],

          // Radix UI - group together
          "radix-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-label",
            "@radix-ui/react-switch",
            "@radix-ui/react-slot",
            "@radix-ui/react-toast",
          ],

          // Zustand state management
          zustand: ["zustand"],

          // Other utilities
          utils: ["clsx", "tailwind-merge", "class-variance-authority", "nanoid"],
        },
      },
    },
    // Increase chunk size warning limit for Monaco
    chunkSizeWarningLimit: 1000,
  },
});
