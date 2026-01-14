import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="flex flex-col gap-2">
      @for (todo of sortedTodos; track todo.id) {
        <app-todo-item
          [todo]="todo"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (moveUp)="onMoveUp($event)"
          (moveDown)="onMoveDown($event)"
        />
      }
    </div>
  `,
})
export class TodoListComponent {
  @Input({ required: true }) todos!: Todo[];
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() moveUp = new EventEmitter<string>();
  @Output() moveDown = new EventEmitter<string>();

  get sortedTodos(): Todo[] {
    return [...this.todos].sort((a, b) => a.order - b.order);
  }

  onEdit(todo: Todo): void {
    this.edit.emit(todo);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onMoveUp(id: string): void {
    this.moveUp.emit(id);
  }

  onMoveDown(id: string): void {
    this.moveDown.emit(id);
  }
}
