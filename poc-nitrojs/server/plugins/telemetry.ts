import type { NitroApp } from "nitropack";

export default (nitroApp: NitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    const reqId = event.context.reqId;
    const url = new URL(
      event.node.req.url!,
      `http://${event.node.req.headers.host}`
    );
    console.log(`[${reqId}] ${event.node.req.method} ${url.pathname}`);
  });
  nitroApp.hooks.hook("afterResponse", (event) => {
    // aqui você poderia enviar métricas, por exemplo
  });
};
