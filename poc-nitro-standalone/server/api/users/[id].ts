// Square brackets in a filename declare a DYNAMIC SEGMENT.
// `server/api/users/[id].ts` matches `/api/users/42`, `/api/users/abc`, etc.
// Read the captured value with `getRouterParam(event, "id")`.
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  return { id, name: `User ${id}` };
});
