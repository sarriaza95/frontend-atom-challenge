// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está logueado, dejamos pasar
  if (authService.isLoggedIn) {
    return true;
  }

  // Si no, lo mandamos al login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }, // opcional, por si luego quieres volver
  });

  return false;
};
