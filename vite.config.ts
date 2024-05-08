import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://horay86.github.io/rock_paper",
  plugins: [react()],
});
