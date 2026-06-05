import { Injectable, signal } from '@angular/core';

// Signal-based auth state so the guard (and template) react to login/logout.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isLoggedIn = signal(false);

  login() {
    this.isLoggedIn.set(true);
  }
  logout() {
    this.isLoggedIn.set(false);
  }
}
