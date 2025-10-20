import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  srcDir: "server",
  preset: "node-server",

  // 💡 regras declarativas por rota (sem tocar no handler)
  routeRules: {
    // cache de 60s já usado
    "/stats": { cache: { maxAge: 60 } },

    // CORS liberado só para /todos (exemplo)
    "/todos/**": {
      cors: true,
      headers: { "x-api-version": "1" }, // injeta header custom
    },

    // redirect 301 (ex.: / -> /todos)
    "/": { redirect: { to: "/todos", statusCode: 301 } },

    // proxy (ex.: roteia /external/* para uma API pública)
    "/external/**": {
      proxy: "https://api.example.com/**", // mantém sufixo
    },
  },
});
// Vantagem: você liga/desliga comportamentos por rota sem tocar no código
