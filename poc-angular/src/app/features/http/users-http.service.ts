import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

// A classic data service: wraps HttpClient and returns typed Observables.
// HttpClient itself is provided once at bootstrap via provideHttpClient().
@Injectable({ providedIn: 'root' })
export class UsersHttpService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://jsonplaceholder.typicode.com';

  // Generic type param makes the response typed end-to-end.
  getUser(id: number): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.base}/users/${id}`);
  }
}
