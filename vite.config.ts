import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import newsHandler from "./api/news";
import definitionHandler from "./api/definition";
import type { Connect } from "vite";
const mount = (middlewares: Connect.Server) => {
  middlewares.use(
    "/api/news",
    (request, response) => void newsHandler(request, response),
  );
  middlewares.use(
    "/api/definition",
    (request, response) => void definitionHandler(request, response),
  );
};
export default defineConfig({
  plugins: [
    react(),
    {
      name: "financepath-api",
      configureServer(server) {
        mount(server.middlewares);
      },
      configurePreviewServer(server) {
        mount(server.middlewares);
      },
    },
  ],
});
