import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

interface CheckUserResponse {
  exists: boolean;
  user?: User;
}

interface RegisterUserResponse {
  message: string;
  user: User;
}

const STORAGE_KEY = 'atom_current_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  // estado interno del usuario
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem(STORAGE_KEY);
    let initialUser: User | null = null;

    if (stored) {
      try {
        initialUser = JSON.parse(stored) as User;
      } catch {
        initialUser = null;
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /** getter rápido para leer el usuario actual de forma síncrona */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /** indica si hay usuario logueado */
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // ─────────────────────────────────────────────
  //  llamadas al backend
  // ─────────────────────────────────────────────

  /** POST /auth/check → verifica si existe el usuario por email */
  checkUser(email: string): Observable<CheckUserResponse> {
    return this.http.post<CheckUserResponse>(
      `${this.baseUrl}/auth/check`,
      { email }
    );
  }

  /**
   * POST /auth/register → registra usuario.
   * Además de llamar a la API, guarda el usuario en el estado y localStorage.
   */
  registerUser(email: string, name?: string): Observable<User> {
    return this.http
      .post<RegisterUserResponse>(`${this.baseUrl}/auth/register`, {
        email,
        name,
      })
      .pipe(
        map((res) => {
          this.setCurrentUser(res.user);
          return res.user;
        })
      );
  }

  /**
   * Llamar a esto cuando desde el login obtengas un usuario existente
   * del endpoint /auth/check.
   */
  loginWithExistingUser(user: User): void {
    this.setCurrentUser(user);
  }

  /** Limpia usuario en memoria y en localStorage */
  logout(): void {
    this.setCurrentUser(null);
  }

  // ─────────────────────────────────────────────
  //  helpers privados
  // ─────────────────────────────────────────────

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
