import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../../models/todo-item.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'todo-list',
  template: `
    <ul class="list-none pl-0">
      <li *ngFor="let todo of todos; trackBy: trackById" class="mb-2">
        <todo-item [todo]="todo"></todo-item>
      </li>
    </ul>

    <div *ngIf="todos.length === 0" class="text-center text-gray-500 py-8">
      <p class="text-lg">No todos yet</p>
      <p class="text-sm">Add your first todo item above!</p>
    </div>
  `,
  imports: [CommonModule, TodoItemComponent],
  standalone: true
})
export class TodoListComponent {
  @Input({ required: true }) todos: TodoItem[] = [];

  // TrackBy function for performance optimization
  trackById(index: number, item: TodoItem): string {
    return item.id;
  }
}