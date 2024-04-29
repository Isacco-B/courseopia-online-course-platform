import dotenv from "dotenv";
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
  },
});
