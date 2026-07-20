// SERVER-SENT EVENTS: a long-lived response that pushes messages to the
// client over one connection. createEventStream (from h3, auto-imported)
// sets the text/event-stream headers and hands back push()/onClosed helpers.
//
// Try it: `curl -N http://localhost:3000/events`
export default defineEventHandler((event) => {
  const stream = createEventStream(event);

  let count = 0;
  const interval = setInterval(async () => {
    await stream.push(JSON.stringify({ tick: ++count }));
  }, 1000);

  // Always clean up timers when the client disconnects, or you leak them.
  stream.onClosed(() => clearInterval(interval));

  return stream.send();
});
