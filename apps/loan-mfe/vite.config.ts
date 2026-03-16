import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "loan-mfe",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx"
      },
      shared: ["react", "react-dom", "zustand"]
    })
  ],
  resolve: {
    alias: {
      "@banking/ui": fileURLToPath(new URL("../../packages/ui-library/src", import.meta.url)),
      "@banking/store": fileURLToPath(new URL("../../packages/store/src", import.meta.url))
    }
  },
  build: {
    target: "esnext"
  }
});
