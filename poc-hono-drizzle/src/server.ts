import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT || 3000}`
    );
  }
);
