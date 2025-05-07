import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/finder-icon-mix/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(file) {
          // 将apple图标合并到一个chunk中
          if (file.includes("src/assets/mac-icon/")) {
            return "mac-icon";
          }
        },
      },
    },
  },
});
