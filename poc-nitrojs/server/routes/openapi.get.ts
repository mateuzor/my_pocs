import { defineEventHandler } from "h3";

const spec = {
  openapi: "3.0.3",
  info: { title: "Nitro Todos API", version: "1.0.0" },
  paths: {
    "/todos": {
      get: { summary: "List todos" },
      post: { summary: "Create todo" },
    },
    "/todos/{id}": {
      get: { summary: "Get todo" },
      patch: { summary: "Update todo" },
      delete: { summary: "Delete todo" },
    },
  },
};

export default defineEventHandler(() => spec);
