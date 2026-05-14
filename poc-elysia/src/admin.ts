import { Elysia, t } from 'elysia';
import { parseAuthHeader } from './services';

// .group() lets you mount multiple routes under a shared PREFIX and apply
// common HOOKS / GUARDS / SCHEMAS to all of them at once.
// It's the equivalent of express.Router() — but with type information preserved.
//
// .guard() applies validation or hooks to every route inside its block,
// without forcing you to repeat the same options on each .get/.post call.

export const adminRoutes = new Elysia()
  // All admin routes live under /admin/v1
  .group('/admin/v1', (app) =>
    app
      // GUARD applies to everything inside this block.
      // Any request to /admin/v1/* must have a valid Bearer header,
      // otherwise the request is short-circuited with a 401 before the handler runs.
      .guard(
        {
          // beforeHandle inside a guard = "this guard's logic"
          beforeHandle: ({ headers, set }) => {
            const user = parseAuthHeader(headers.authorization);
            if (!user) {
              set.status = 401;
              return { error: 'Authentication required' };
            }
            // Returning undefined = "keep going to the route handler"
          },
        },
        (app) =>
          app
            .get('/dashboard', () => ({
              widgets: ['users', 'tasks', 'metrics'],
              note: 'You only see this if the guard passed',
            }))

            // Routes inside a guard can still declare their own validation —
            // they compose with the guard's hooks
            .post(
              '/announcements',
              ({ body }) => ({ ok: true, announcement: body }),
              {
                body: t.Object({
                  title: t.String({ minLength: 1 }),
                  message: t.String({ minLength: 1 }),
                }),
                detail: { summary: 'Post an announcement (admin-only)' },
              }
            )

            // Nested .group() inside a group — composition all the way down
            .group('/users', (app) =>
              app
                .get('/', () => ({
                  users: [{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }],
                }))
                .delete(
                  '/:id',
                  ({ params }) => ({ deleted: params.id }),
                  {
                    params: t.Object({ id: t.Numeric() }),
                    detail: { summary: 'Delete a user (admin-only)' },
                  }
                )
            )
      )

      // PUBLIC route inside the group prefix (no guard applied)
      // The guard only affects routes INSIDE its callback, not siblings.
      .get('/health', () => ({ status: 'ok' }))
  );
