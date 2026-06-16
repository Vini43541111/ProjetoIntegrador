import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/planos": "http://localhost:3009",
      "/pacientes": "http://localhost:3009",
      "/cobertura": "http://localhost:3009",
      "/health": "http://localhost:3009",
    },
  },
});
