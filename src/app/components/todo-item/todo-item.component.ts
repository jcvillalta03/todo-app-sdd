import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ todo.title }}</span>
          @if (isPastDue) {
            <span class="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Past Due</span>
          }
        </div>
        @if (todo.dueDate) {
          <div class="text-sm text-gray-500 mt-1">
            Due: {{ formatDate(todo.dueDate) }}
          </div>
        }
      </div>
      <div class="flex gap-2">
        <button
          (click)="onEdit()"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label="Edit todo"
        >
          Edit
        </button>
        <button
          (click)="onMoveUp()"
          class="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          aria-label="Move up"
        >
          ↑
        </button>
        <button
          (click)="onMoveDown()"
          class="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          (click)="onDelete()"
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  `,
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() moveUp = new EventEmitter<string>();
  @Output() moveDown = new EventEmitter<string>();

  get isPastDue(): boolean {
    if (!this.todo.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  onMoveUp(): void {
    this.moveUp.emit(this.todo.id);
  }

  onMoveDown(): void {
    this.moveDown.emit(this.todo.id);
  }
}
