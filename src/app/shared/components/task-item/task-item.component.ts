import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  @Input() task!: Task;

  @Output() toggleCompleted = new EventEmitter<Task>();
  @Output() update = new EventEmitter<{ task: Task; changes: { title: string; description: string } }>();
  @Output() delete = new EventEmitter<Task>();

  isEditing = false;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnChanges(): void {
    if (this.task && !this.isEditing) {
      this.editForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
      });
    }
  }

  onToggleCompleted(): void {
    this.toggleCompleted.emit(this.task);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editForm.patchValue({
      title: this.task.title,
      description: this.task.description || '',
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset({
      title: this.task.title,
      description: this.task.description || '',
    });
  }

  saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { title, description } = this.editForm.value;
    this.update.emit({
      task: this.task,
      changes: {
        title: title.trim(),
        description: (description || '').trim(),
      },
    });

    this.isEditing = false;
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }
}
