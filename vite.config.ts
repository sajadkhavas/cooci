import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

const vendorChunk = (id: string) => {
  if (!id.includes("node_modules")) return undefined;

  if (
    /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
      id,
    )
  ) {
    return "react-vendor";
  }

  if (id.includes("@tanstack/react-query")) return "query-vendor";

  if (
    id.includes("react-hook-form") ||
    id.includes("@hookform/resolvers") ||
    id.includes("/zod/")
  ) {
    return "forms-vendor";
  }

  if (id.includes("@radix-ui")) return "ui-vendor";
  if (id.includes("lucide-react")) return "icons-vendor";

  if (
    id.includes("recharts") ||
    id.includes("d3-") ||
    id.includes("victory-vendor")
  ) {
    return "charts-vendor";
  }

  return undefined;
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    assetsInlineLimit: 2_048,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
}));
