import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../../services/todo-data.service';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-container',
  standalone: true,
  imports: [FormsModule, CommonModule, TodoListComponent],
  template: `
    <section class="p-4 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Todo List</h1>

      <!-- Add Todo Form -->
      <form
        (ngSubmit)="onAdd()"
        class="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50"
      >
        <div class="flex flex-col gap-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              [(ngModel)]="newTodoTitle"
              name="title"
              placeholder="Enter todo title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              [(ngModel)]="newTodoDueDate"
              name="dueDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Todo
          </button>
        </div>
      </form>

      <!-- Edit Todo Form (shown when editing) -->
      @if (editingTodo) {
        <div class="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
          <h2 class="text-lg font-semibold mb-4">Edit Todo</h2>
          <form (ngSubmit)="onUpdate()" class="flex flex-col gap-4">
            <div>
              <label for="editTitle" class="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="editTitle"
                type="text"
                [(ngModel)]="editTodoTitle"
                name="editTitle"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label for="editDueDate" class="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="editDueDate"
                type="date"
                [(ngModel)]="editTodoDueDate"
                name="editDueDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex gap-2">
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save
              </button>
              <button
                type="button"
                (click)="onCancelEdit()"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Todo List -->
      <app-todo-list
        [todos]="todos()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (moveUp)="onMoveUp($event)"
        (moveDown)="onMoveDown($event)"
      />
    </section>
  `,
})
export class TodoContainerComponent {
  private todoService = inject(TodoDataService);
  todos = this.todoService.getTodos();

  newTodoTitle = '';
  newTodoDueDate: string | null = null;

  editingTodo: Todo | null = null;
  editTodoTitle = '';
  editTodoDueDate: string | null = null;

  onAdd(): void {
    if (this.newTodoTitle.trim()) {
      const dueDate = this.newTodoDueDate ? new Date(this.newTodoDueDate) : null;
      this.todoService.addTodo(this.newTodoTitle.trim(), dueDate);
      this.newTodoTitle = '';
      this.newTodoDueDate = null;
    }
  }

  onEdit(todo: Todo): void {
    this.editingTodo = todo;
    this.editTodoTitle = todo.title;
    this.editTodoDueDate = todo.dueDate
      ? new Date(todo.dueDate).toISOString().split('T')[0]
      : null;
  }

  onUpdate(): void {
    if (this.editingTodo && this.editTodoTitle.trim()) {
      const dueDate = this.editTodoDueDate ? new Date(this.editTodoDueDate) : null;
      this.todoService.updateTodo(this.editingTodo.id, {
        title: this.editTodoTitle.trim(),
        dueDate,
      });
      this.onCancelEdit();
    }
  }

  onCancelEdit(): void {
    this.editingTodo = null;
    this.editTodoTitle = '';
    this.editTodoDueDate = null;
  }

  onDelete(id: string): void {
    this.todoService.removeTodo(id);
  }

  onMoveUp(id: string): void {
    this.todoService.reorderTodo(id, 'up');
  }

  onMoveDown(id: string): void {
    this.todoService.reorderTodo(id, 'down');
  }
}
