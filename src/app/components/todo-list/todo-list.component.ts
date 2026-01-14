import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() pastDueIds: Set<string> = new Set();
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onToggle(id: string): void {
    this.toggle.emit(id);
  }

  onEdit(todo: Todo): void {
    this.edit.emit(todo);
  }

  isPastDue(id: string): boolean {
    return this.pastDueIds.has(id);
  }
}
