import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// FUNCTIONAL guard — just a function returning boolean | UrlTree. It runs in an
// injection context, so inject() works to pull services. Returning a UrlTree
// REDIRECTS instead of dead-ending the navigation.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/']); // not authenticated → bounce home
};
