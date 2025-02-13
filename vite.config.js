import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "frontend",
  build: {
    outDir: "../backend/dist",
    emptyOutDir: true,
  },
});
