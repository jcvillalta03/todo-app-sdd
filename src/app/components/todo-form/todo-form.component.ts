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
    <form #todoForm="ngForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div class="flex flex-col gap-2">
        <label for="description" class="text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          id="description"
          type="text"
          [(ngModel)]="description"
          name="description"
          #descriptionInput="ngModel"
          placeholder="Enter todo description"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-gray-300]="!descriptionInput.invalid || !descriptionInput.touched"
          [class.border-red-500]="descriptionInput.invalid && descriptionInput.touched"
          required
        />
        <div *ngIf="descriptionInput.invalid && descriptionInput.touched" class="text-red-600 text-sm">
          Description is required
        </div>
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
          #priorityInput="ngModel"
          min="1"
          max="5"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-gray-300]="!priorityInput.invalid || !priorityInput.touched"
          [class.border-red-500]="priorityInput.invalid && priorityInput.touched"
        />
        <div *ngIf="priorityInput.invalid && priorityInput.touched" class="text-red-600 text-sm">
          <span *ngIf="priorityInput.errors?.['min'] || priorityInput.errors?.['max']">
            Priority must be between 1 and 5
          </span>
        </div>
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