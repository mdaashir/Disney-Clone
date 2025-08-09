import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/Components"),
      "@services": resolve(__dirname, "./src/Services"),
      "@contexts": resolve(__dirname, "./src/contexts"),
      "@constants": resolve(__dirname, "./src/Constants"),
      "@types": resolve(__dirname, "./src/types"),
      "@lib": resolve(__dirname, "./src/lib"),
      "@assets": resolve(__dirname, "./src/Assets"),
    },
  },
  build: {
    // Enable source maps for production debugging
    sourcemap: process.env.NODE_ENV === "development",

    // Optimize chunk sizes
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "animation-vendor": ["framer-motion"],
          "ui-vendor": ["lucide-react"],
          "query-vendor": ["@tanstack/react-query"],

          // Feature chunks
          auth: [
            "./src/contexts/AuthContext",
            "./src/Components/auth/AuthModal",
          ],
          search: [
            "./src/contexts/SearchContext",
            "./src/Components/search/SearchBar",
          ],
          watchlist: [
            "./src/contexts/WatchlistContext",
            "./src/Components/watchlist/WatchlistPage",
          ],
          player: ["./src/Components/player/VideoPlayer"],
          dashboard: ["./src/Components/dashboard/UserDashboard"],
          notifications: ["./src/Components/notifications/NotificationSystem"],
          social: [
            "./src/Components/social/SocialFeatures",
            "./src/Components/sharing/ShareSystem",
          ],
        },
        // Optimize file naming
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },

    // Optimize build performance
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
        pure_funcs:
          process.env.NODE_ENV === "production" ? ["console.log"] : [],
      },
      format: {
        comments: false,
      },
    },

    // Set chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Optimize assets
    assetsInlineLimit: 4096, // 4kb
  },

  // Development server optimizations
  server: {
    hmr: {
      overlay: true,
    },
    open: true,
  },

  // Preview server for production builds
  preview: {
    port: 4173,
    open: true,
  },

  // Performance optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "@tanstack/react-query",
    ],
    exclude: ["@vite/client", "@vite/env"],
  },

  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // CSS optimization
  css: {
    devSourcemap: process.env.NODE_ENV === "development",
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === "js") {
        return { js: `window.__assetsPath(${JSON.stringify(filename)})` };
      } else {
        return { relative: true };
      }
    },
  },
});
