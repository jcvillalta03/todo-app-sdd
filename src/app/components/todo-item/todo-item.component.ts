import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../../models/todo-item.model';

@Component({
  selector: 'todo-item',
  template: `
    <div
      class="border rounded-lg p-4 mb-2 shadow-sm"
      [class]="itemClasses()"
    >
      <div class="flex justify-between items-start">
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
      </div>
    </div>
  `,
  imports: [CommonModule],
  standalone: true
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: TodoItem;

  // Computed property for dynamic classes
  itemClasses = computed(() => {
    const baseClasses = 'border rounded-lg p-4 mb-2 shadow-sm';
    const pastDueClasses = this.isPastDue() ? 'text-red-700 border-red-300 bg-red-50' : 'text-gray-900 border-gray-200 bg-white';
    return `${baseClasses} ${pastDueClasses}`;
  });

  priorityClasses = computed(() => {
    const priorityColors = {
      1: 'bg-gray-200 text-gray-800', // Lowest
      2: 'bg-blue-200 text-blue-800',
      3: 'bg-yellow-200 text-yellow-800',
      4: 'bg-orange-200 text-orange-800',
      5: 'bg-red-200 text-red-800' // Highest
    };
    return priorityColors[this.todo.priority as keyof typeof priorityColors] || priorityColors[3];
  });

  isPastDue(): boolean {
    if (!this.todo.dueDate) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return this.todo.dueDate <= today;
  }

  formatCreatedDate(): string {
    try {
      const date = new Date(this.todo.createdAt);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return this.todo.createdAt;
    }
  }
}