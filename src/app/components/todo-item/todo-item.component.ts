import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() isPastDue = false;
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  formatDate(date: Date | null): string {
    if (!date) {
      return 'No due date';
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
