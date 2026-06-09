import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// FUNCTIONAL interceptor (v15+, the modern form — no class implementing
// HttpInterceptor). It runs in an injection context, so inject() works here.
// Every HttpClient request flows through this pipe.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Requests are immutable — clone() to attach an auth header when logged in.
  const authReq = auth.isLoggedIn()
    ? req.clone({ setHeaders: { Authorization: 'Bearer demo-token' } })
    : req;

  console.log(`[HTTP] → ${authReq.method} ${authReq.url}`);

  // next() forwards to the next interceptor / the backend; we tap the response.
  return next(authReq).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(`[HTTP] ← ${event.status} ${authReq.url}`);
      }
    })
  );
};
