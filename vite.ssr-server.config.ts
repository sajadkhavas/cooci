import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: path.resolve(process.cwd(), "server.runtime.mjs"),
    outDir: "build/runtime",
    emptyOutDir: true,
    target: "node22",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "server.mjs",
        chunkFileNames: "chunks/[name]-[hash].mjs",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  ssr: {
    noExternal: true,
  },
});
