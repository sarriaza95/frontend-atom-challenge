// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/users/${userId}/tasks`);
  }

  createTask(
    userId: string,
    payload: { title: string; description?: string }
  ): Observable<{ message: string; task: Task }> {
    return this.http.post<{ message: string; task: Task }>(
      `${this.baseUrl}/users/${userId}/tasks`,
      payload
    );
  }

  updateTask(
    userId: string,
    taskId: string,
    payload: Partial<Task>
  ): Observable<{ message: string; task: Task }> {
    return this.http.patch<{ message: string; task: Task }>(
      `${this.baseUrl}/users/${userId}/tasks/${taskId}`,
      payload
    );
  }

  deleteTask(userId: string, taskId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/users/${userId}/tasks/${taskId}`
    );
  }
}
