// src/app/features/tasks/pages/tasks-page/tasks-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../../../core/services/auth.service';
import { TaskService } from '../../../../core/services/task.service';
import { User } from '../../../../core/models/user.model';
import { Task } from '../../../../core/models/task.model';

import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskItemComponent } from '../../../../shared/components/task-item/task-item.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    TaskFormComponent,
    TaskItemComponent,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
  user: User | null = null;
  tasks: Task[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
  }

  // ─────────────────────────────────────────────
  //  Getters para separar y contar tareas
  // ─────────────────────────────────────────────
  get pendingTasks(): Task[] {
    return this.tasks.filter((t) => !t.completed);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((t) => t.completed);
  }

  get pendingCount(): number {
    return this.pendingTasks.length;
  }

  get completedCount(): number {
    return this.completedTasks.length;
  }

  loadTasks(): void {
    if (!this.user) return;

    this.loading = true;
    this.errorMessage = null;

    this.taskService.getTasks(this.user.id).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar las tareas.';
        this.loading = false;
      },
    });
  }

  onCreateTask(payload: { title: string; description?: string }): void {
    if (!this.user) return;

    this.taskService.createTask(this.user.id, payload).subscribe({
      next: (res) => {
        this.tasks = [res.task, ...this.tasks];
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al crear la tarea.';
      },
    });
  }

  onToggleCompleted(task: Task): void {
    if (!this.user) return;

    this.taskService
      .updateTask(this.user.id, task.id, { completed: !task.completed })
      .subscribe({
        next: (res) => {
          this.tasks = this.tasks.map((t) =>
            t.id === task.id ? res.task : t
          );
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar la tarea.';
        },
      });
  }

  onUpdateTask(event: { task: Task; changes: { title: string; description: string } }): void {
    if (!this.user) return;

    const { task, changes } = event;

    this.taskService
      .updateTask(this.user.id, task.id, {
        title: changes.title,
        description: changes.description,
      })
      .subscribe({
        next: (res) => {
          this.tasks = this.tasks.map((t) =>
            t.id === task.id ? res.task : t
          );
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar la tarea.';
        },
      });
  }

  onDeleteTask(task: Task): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar tarea',
        message: `¿Seguro que deseas eliminar la tarea "${task.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.taskService.deleteTask(this.user!.id, task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== task.id);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al eliminar la tarea.';
        },
      });
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
