import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp4}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "tmdb-api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}`;
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Disney+ Clone",
        short_name: "Disney+",
        description: "A premium Disney+ streaming platform clone",
        theme_color: "#000000",
        icons: [
          {
            src: "Disney.ico",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  assetsInclude: ["**/*.png", "**/*.mp4"],
  base: "/Disney-Clone",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/Components": fileURLToPath(
        new URL("./src/Components", import.meta.url),
      ),
      "@/lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@/hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@/types": fileURLToPath(new URL("./src/types", import.meta.url)),
      "@/store": fileURLToPath(new URL("./src/store", import.meta.url)),
      "@/api": fileURLToPath(new URL("./src/api", import.meta.url)),
      "@/Assets": fileURLToPath(new URL("./src/Assets", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
