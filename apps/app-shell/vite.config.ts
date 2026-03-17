import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const shared = {
  react: { singleton: true },
  "react-dom": { singleton: true },
  "react-router-dom": { singleton: true },
  zustand: { singleton: true },
  "@banking/store": { singleton: true }
} as any;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app-shell",
      remotes: {
        "loan-mfe": "http://localhost:3001/assets/remoteEntry.js",
        "onboarding-mfe": "http://localhost:3002/assets/remoteEntry.js"
      },
      shared
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3000,
    strictPort: true
  },
  build: {
    target: "esnext",
    modulePreload: false,
    cssCodeSplit: false,
    minify: false
  }
});
