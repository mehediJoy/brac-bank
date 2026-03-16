import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { fileURLToPath, URL } from "node:url";

/**
 * Workaround for a known bug in @originjs/vite-plugin-federation.
 *
 * The plugin injects a `__v__css__<path>` *string* placeholder into
 * remoteEntry.js, but` dynamicLoadingCss()` calls `.forEach()` on it,
 * which crashes because strings don't have that method.
 *
 * This post-build plugin scans the final bundle for every CSS asset,
 * then replaces the broken placeholder call with a proper array so
 * that `dynamicLoadingCss()` works correctly.
 */
function fixRemoteEntryCss(): Plugin {
  return {
    name: "fix-remote-entry-css",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const cssFiles = Object.values(bundle)
        .filter((chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css"))
        .map((asset) => asset.fileName.split("/").pop() ?? asset.fileName);

      const remoteEntry = Object.values(bundle).find(
        (chunk) => chunk.type === "chunk" && chunk.fileName.endsWith("remoteEntry.js")
      );

      if (!remoteEntry || remoteEntry.type !== "chunk") return;

      // Replace the broken string placeholder with a proper CSS filename array
      remoteEntry.code = remoteEntry.code.replace(
        /a\(`__v__css__[^`]*`,/g,
        `a(${JSON.stringify(cssFiles)},`
      );
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "onboarding-mfe",
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
    port: 3002,
    strictPort: true
  },
  resolve: {
    alias: {
      "@banking/ui": fileURLToPath(new URL("../../packages/ui-library/src", import.meta.url)),
      "@banking/store": fileURLToPath(new URL("../../packages/store/src", import.meta.url))
    }
  },
  build: {
    target: "esnext",
    cssCodeSplit: false
  }
});
