import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
    });
  }

  get emailControl() {
    return this.form.get('email');
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = (this.emailControl?.value as string)
      .trim()
      .toLowerCase();

    this.loading = true;

    this.authService.checkUser(email).subscribe({
      next: (res) => {
        if (res.exists && res.user) {
          // Usuario ya existe → guardamos en estado y navegamos
          this.handleExistingUser(res.user);
        } else {
          // Usuario NO existe → preguntar si desea crearlo
          this.askToCreateUser(email);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ocurrió un error al verificar el usuario.';
        this.loading = false;
      },
    });
  }

  private handleExistingUser(user: User): void {
    this.authService.loginWithExistingUser(user);
    this.loading = false;
    this.router.navigate(['/tasks']);
  }

  private askToCreateUser(email: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Crear usuario',
        message: `No encontramos un usuario con el correo "${email}". ¿Deseas crear uno nuevo?`,
        confirmText: 'Sí, crear usuario',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        this.loading = false;
        return;
      }

      // Crear usuario
      this.authService.registerUser(email).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ocurrió un error al crear el usuario.';
          this.loading = false;
        },
      });
    });
  }
}
