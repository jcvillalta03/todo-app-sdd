import { Component, Input, Output, EventEmitter, computed, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../models/todo-item.model';

export interface UpdateTodoEvent {
  description: string;
  priority: number;
  dueDate: string | null;
}

@Component({
  selector: 'todo-item',
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="border rounded-lg p-4 mb-2 shadow-sm"
      [class]="itemClasses()"
    >
      <!-- View Mode -->
      <div *ngIf="!isEditing" class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ todo.description }}</h3>

          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <span data-testid="priority" class="flex items-center gap-1">
              <span class="font-medium">Priority:</span>
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                [class]="priorityClasses()"
              >
                {{ todo.priority }}
              </span>
            </span>

            <span *ngIf="todo.dueDate" class="flex items-center gap-1">
              <span class="font-medium">Due:</span>
              <span>{{ todo.dueDate }}</span>
            </span>

            <span class="flex items-center gap-1">
              <span class="font-medium">Created:</span>
              <span>{{ formatCreatedDate() }}</span>
            </span>
          </div>
        </div>

        <div class="ml-4 flex gap-2">
          <button
            (click)="onEditStart()"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit todo"
          >
            Edit
          </button>
          <button
            (click)="onDelete()"
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <form *ngIf="isEditing" (ngSubmit)="onSave()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="edit-description" class="text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="edit-description"
            type="text"
            [(ngModel)]="editDescription"
            name="editDescription"
            placeholder="Enter todo description"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="edit-priority" class="text-sm font-medium text-gray-700">
            Priority (1-5)
          </label>
          <select
            id="edit-priority"
            [(ngModel)]="editPriority"
            name="editPriority"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option [value]="1">1 - Lowest</option>
            <option [value]="2">2</option>
            <option [value]="3">3 - Normal</option>
            <option [value]="4">4</option>
            <option [value]="5">5 - Highest</option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label for="edit-dueDate" class="text-sm font-medium text-gray-700">
            Due Date (optional)
          </label>
          <input
            id="edit-dueDate"
            type="date"
            [(ngModel)]="editDueDate"
            name="editDueDate"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex gap-2 justify-end">
          <button
            type="button"
            (click)="onCancel()"
            class="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            [disabled]="!editDescription.trim()"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  standalone: true
})
export class TodoItemComponent implements OnChanges {
  @Input({ required: true }) set todo(value: TodoItem) {
    this.todoSignal.set(value);
  }
  get todo(): TodoItem {
    return this.todoSignal();
  }
  private todoSignal = signal<TodoItem>({} as TodoItem);

  @Input() isEditing = false;

  @Output() editStart = new EventEmitter<void>();
  @Output() updateTodo = new EventEmitter<UpdateTodoEvent>();
  @Output() editCancel = new EventEmitter<void>();
  @Output() deleteTodo = new EventEmitter<string>();

  // Form model for editing
  editDescription = '';
  editPriority = 3;
  editDueDate = '';

  // Computed property for dynamic classes
  itemClasses = computed(() => {
    const todo = this.todoSignal();
    const baseClasses = 'border rounded-lg p-4 mb-2 shadow-sm';
    const pastDueClasses = this.isPastDue(todo) ? 'text-red-700 border-red-300 bg-red-50' : 'text-gray-900 border-gray-200 bg-white';
    return `${baseClasses} ${pastDueClasses}`;
  });

  priorityClasses = computed(() => {
    const todo = this.todoSignal();
    const priorityColors = {
      1: 'bg-gray-200 text-gray-800', // Lowest
      2: 'bg-blue-200 text-blue-800',
      3: 'bg-yellow-200 text-yellow-800',
      4: 'bg-orange-200 text-orange-800',
      5: 'bg-red-200 text-red-800' // Highest
    };
    return priorityColors[todo.priority as keyof typeof priorityColors] || priorityColors[3];
  });

  ngOnChanges(changes: SimpleChanges) {
    // Initialize edit form values when entering edit mode
    if (changes['isEditing'] && this.isEditing) {
      const todo = this.todoSignal();
      this.editDescription = todo.description;
      this.editPriority = todo.priority;
      this.editDueDate = todo.dueDate || '';
    }
  }

  onEditStart() {
    this.editStart.emit();
  }

  onSave() {
    if (this.editDescription.trim()) {
      this.updateTodo.emit({
        description: this.editDescription.trim(),
        priority: this.editPriority,
        dueDate: this.editDueDate || null
      });
    }
  }

  onCancel() {
    this.editCancel.emit();
  }

  onDelete() {
    this.deleteTodo.emit(this.todoSignal().id);
  }

  isPastDue(todo: TodoItem = this.todoSignal()): boolean {
    if (!todo.dueDate) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return todo.dueDate <= today;
  }

  formatCreatedDate(): string {
    const todo = this.todoSignal();
    try {
      const date = new Date(todo.createdAt);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return todo.createdAt;
    }
  }
}