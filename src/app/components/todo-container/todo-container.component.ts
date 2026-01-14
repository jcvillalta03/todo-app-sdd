import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoDataService } from '../../services/todo-data.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-container',
  imports: [FormsModule, CommonModule, TodoListComponent],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.css'
})
export class TodoContainerComponent {
  private todoService = inject(TodoDataService);
  todos = this.todoService.getTodos();

  // Form state
  title = '';
  priority = 1;
  dueDate = '';
  editingTodo: Todo | null = null;

  // Computed past due IDs
  pastDueIds = computed(() => {
    const ids = new Set<string>();
    this.todos().forEach(todo => {
      if (this.todoService.isPastDue(todo)) {
        ids.add(todo.id);
      }
    });
    return ids;
  });

  addTodo(): void {
    const titleValue = this.title.trim();
    if (!titleValue) {
      return;
    }

    const dueDateValue = this.dueDate ? new Date(this.dueDate) : null;
    this.todoService.addTodo(titleValue, this.priority, dueDateValue);
    this.resetForm();
  }

  updateTodo(): void {
    const todo = this.editingTodo;
    if (!todo) {
      return;
    }

    const titleValue = this.title.trim();
    if (!titleValue) {
      return;
    }

    const dueDateValue = this.dueDate ? new Date(this.dueDate) : null;
    this.todoService.updateTodo(todo.id, {
      title: titleValue,
      priority: this.priority,
      dueDate: dueDateValue
    });
    this.resetForm();
  }

  deleteTodo(id: string): void {
    this.todoService.removeTodo(id);
  }

  toggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  editTodo(todo: Todo): void {
    this.editingTodo = todo;
    this.title = todo.title;
    this.priority = todo.priority;
    this.dueDate = todo.dueDate ? this.formatDateForInput(todo.dueDate) : '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    if (this.editingTodo) {
      this.updateTodo();
    } else {
      this.addTodo();
    }
  }

  private resetForm(): void {
    this.title = '';
    this.priority = 1;
    this.dueDate = '';
    this.editingTodo = null;
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
