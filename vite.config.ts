import { defineConfig } from "vite";

export default defineConfig({
  base: "/noor-personal-shopper/",
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
  },
});
