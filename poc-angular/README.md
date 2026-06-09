# poc-angular

A standalone **Angular 20** app built to show *what's new* in modern Angular —
no NgModules, no zone.js, signals everywhere.

### Angular 20 features in this POC

| Feature | Where | Why it's new / matters |
|---------|-------|------------------------|
| **Zoneless change detection** | `main.ts` → `provideZonelessChangeDetection()` | Stable in v20. Drops zone.js; signals schedule CD directly → smaller bundle, faster, predictable. |
| **Standalone by default** | every `@Component` (no `standalone: true`) | Default since v19 — `standalone: true` is now redundant. |
| **Signals** | `app.component.ts` → `signal` / `computed` | Reactive state + memoized derived state; the core of CD in zoneless. |
| **`linkedSignal()` / `effect()`** | `counter.component.ts` | Writable state that re-syncs from a source; `effect` for side effects. |
| **Signal I/O `input()` / `output()` / `model()`** | `counter.component.ts` | Replace `@Input()`/`@Output()`; `model()` gives signal two-way binding `[(value)]`. |
| **`resource()`** | `users.component.ts` | Declarative async: `value()`/`error()`/`isLoading()` as signals, auto-abort. (HTTP variant: `httpResource`.) |
| **Built-in control flow** | templates → `@if` `@for` `@let` `@defer` | Replaces `*ngIf`/`*ngFor`; `@defer` lazy-renders on viewport. |
| **Functional guards** | `guards/auth.guard.ts` → `CanActivateFn` | Plain function with `inject()`; returns `UrlTree` to redirect. |
| **Lazy routing** | `app.routes.ts` → `loadComponent` | Each route ships as its own chunk. |

### HTTP & data layer (`features/http/`)

| Piece | File | Idea |
|-------|------|------|
| `provideHttpClient()` | `main.ts` | registers HttpClient app-wide, no `HttpClientModule` |
| Typed service | `users-http.service.ts` | `http.get<ApiUser>()` — typed end-to-end Observable |
| `toSignal()` | `http-demo.component.ts` | bridge an Observable → signal, auto-unsubscribe |
| `httpResource()` | `http-demo.component.ts` | v20 declarative HTTP: `value()`/`isLoading()`/`error()` as signals, auto-abort |
| Functional interceptor | `auth.interceptor.ts` | `HttpInterceptorFn` + `withInterceptors()`; clones req to add auth header, logs req/res |

**Pitch:** `toSignal` is the bridge for existing RxJS/HttpClient code; `httpResource`
is the new signal-native way to fetch (no service, no subscribe). Interceptors are
now plain functions that use `inject()` and run in an injection context.

### Pitch de mentoria
- **Zoneless is the headline of v20**: without zone.js, Angular relies on signals
  to know what changed — so understanding signals *is* understanding modern CD.
- **Signals unify reactivity**: state (`signal`), derivation (`computed`),
  I/O (`input`/`output`/`model`), and async (`resource`) all speak the same API.
- **Templates got declarative**: `@if/@for/@defer` are compiler features (faster,
  type-checked) instead of structural directives.

### Run
```bash
npm install
npm start     # ng serve — toggle login to see the dashboard guard redirect
```
