import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { fileURLToPath, URL } from "node:url";

function fixRemoteEntryCss(): Plugin {
  return {
    name: "fix-remote-entry-css",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const cssFiles = Object.values(bundle)
        .filter((chunk) => chunk.type === "asset")
        .map((asset) => asset.fileName)
        .filter((fileName) => fileName.endsWith(".css"))
        .map((fileName) => fileName.split("/").pop() ?? fileName);

      const remoteEntry = Object.values(bundle).find(
        (chunk) => chunk.type === "chunk" && chunk.fileName.endsWith("remoteEntry.js")
      );

      if (!remoteEntry || remoteEntry.type !== "chunk") return;

      remoteEntry.code = remoteEntry.code.replace(
        /a\(`__v__css__[^`]+`,!0,`\.\/*App`\)/g,
        `a(${JSON.stringify(cssFiles)},!0,\`./App\`)`
      );
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "loan-mfe",
      filename: "remoteEntry.js",
      exposes: {
        "./App": {
          import: "./src/App.tsx",
          dontAppendStylesToHead: true
        }
      },
      shared: ["react", "react-dom", "zustand"]
    }),
    fixRemoteEntryCss()
  ],
  server: {
    port: 3001,
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
