import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../../models/todo-item.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'todo-list',
  template: `
    <ul class="list-none pl-0">
      @for (todo of todos(); track trackById($index, todo)) {
        <li class="mb-2">
          <todo-item [todo]="todo"></todo-item>
        </li>
      }
    </ul>

    @if (todos().length === 0) {
      <div class="text-center text-gray-500 py-8">
        <p class="text-lg">No todos yet</p>
        <p class="text-sm">Add your first todo item above!</p>
      </div>
    }
  `,
  imports: [CommonModule, TodoItemComponent]
})
export class TodoListComponent {
  todos = input.required<TodoItem[]>();

  // TrackBy function for performance optimization
  trackById(index: number, item: TodoItem): string {
    return item.id;
  }
}