import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API = "http://localhost:3009";

// Só proxia se for chamada fetch/XHR (não navegação do browser)
function apiOnly(req) {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return "/index.html";
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/planos":   { target: API, bypass: apiOnly },
      "/pacientes":{ target: API, bypass: apiOnly },
      "/cobertura":{ target: API, bypass: apiOnly },
      "/health":   { target: API, bypass: apiOnly },
    },
  },
});
