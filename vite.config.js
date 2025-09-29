// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],   // <- pastikan ini array, bukan react() doang
  // server: { hmr: { overlay: false } } // opsional
});
