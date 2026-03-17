import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const shared = {
  react: { singleton: true },
  "react-dom": { singleton: true },
  zustand: { singleton: true },
  "@banking/store": { singleton: true }
} as any;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "loan-mfe",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx"
      },
      shared
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3001,
    strictPort: true
  },
  build: {
    target: "esnext",
    modulePreload: false,
    cssCodeSplit: false,
    minify: false
  }
});
