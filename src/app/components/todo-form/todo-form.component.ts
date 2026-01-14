import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface AddTodoEvent {
  description: string;
  priority: number;
  dueDate: string | null;
}

@Component({
  selector: 'todo-form',
  template: `
    <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div class="flex flex-col gap-2">
        <label for="description" class="text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          id="description"
          type="text"
          [(ngModel)]="description"
          name="description"
          placeholder="Enter todo description"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="priority" class="text-sm font-medium text-gray-700">
          Priority (1-5)
        </label>
        <input
          id="priority"
          type="number"
          [(ngModel)]="priority"
          name="priority"
          min="1"
          max="5"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="dueDate" class="text-sm font-medium text-gray-700">
          Due Date (optional)
        </label>
        <input
          id="dueDate"
          type="date"
          [(ngModel)]="dueDate"
          name="dueDate"
          placeholder="Due date (optional)"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        [disabled]="!description.trim()"
      >
        Add Todo
      </button>
    </form>
  `,
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class TodoFormComponent {
  @Output() addTodo = new EventEmitter<AddTodoEvent>();

  description = '';
  priority = 3;
  dueDate = '';

  onSubmit() {
    if (this.description.trim()) {
      this.addTodo.emit({
        description: this.description.trim(),
        priority: this.priority,
        dueDate: this.dueDate || null
      });

      // Clear form
      this.description = '';
      this.priority = 3;
      this.dueDate = '';
    }
  }
}