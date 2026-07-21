// sendStream streams a Web ReadableStream to the client chunk by chunk
// instead of buffering the whole body in memory. Ideal for large files,
// proxied downloads, or generated content — memory stays flat regardless
// of payload size.
export default defineEventHandler((event) => {
  const encoder = new TextEncoder();
  let n = 0;

  const readable = new ReadableStream({
    pull(controller) {
      if (n >= 5) {
        return controller.close();
      }
      controller.enqueue(encoder.encode(`chunk ${++n}\n`));
    },
  });

  setResponseHeader(event, "content-type", "text/plain");
  return sendStream(event, readable);
});
