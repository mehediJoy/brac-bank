import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app-shell",
      remotes: {
        "loan-mfe": "http://localhost:3001/assets/remoteEntry.js",
        "onboarding-mfe": "http://localhost:3002/assets/remoteEntry.js"
      },
      shared: ["react", "react-dom", "zustand"]
    })
  ],
  server: {
    port: 3000,
    strictPort: true
  },
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
