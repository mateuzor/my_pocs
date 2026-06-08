import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// `loadComponent` lazy-loads a standalone component as its own chunk — the
// dashboard code isn't downloaded until the user navigates there.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dashboard',
    // canActivate runs the guard before the route loads. Blocked → redirected.
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'http',
    loadComponent: () =>
      import('./features/http/http-demo.component').then((m) => m.HttpDemoComponent),
  },
];
