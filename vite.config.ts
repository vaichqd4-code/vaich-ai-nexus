// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // Keep root static assets (including /favicon.ico) in every production bundle.
    publicDir: "public",
    build: {
      target: "es2022",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("admin") || id.includes("components/admin") || id.includes("components\\admin")) {
              return "admin-portal";
            }
            if (id.includes("node_modules")) {
              if (id.includes("@supabase")) {
                return "supabase-vendor";
              }
              if (id.includes("lucide-react")) {
                return "lucide-icons";
              }
              if (id.includes("@tanstack")) {
                return "tanstack-framework";
              }
              if (id.includes("@radix-ui")) {
                return "radix-primitives";
              }
            }
          },
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
