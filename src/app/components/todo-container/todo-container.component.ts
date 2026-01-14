import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../../services/todo-data.service';
import { TodoFormComponent, AddTodoEvent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'todo-container',
  template: `
    <section class="p-6 max-w-2xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
        <p class="text-gray-600">Manage your weekly tasks with priorities and due dates</p>
      </header>

      <todo-form (addTodo)="onAddTodo($event)" class="mb-8"></todo-form>

      <div class="space-y-4">
        <todo-item
          *ngFor="let todo of todos(); trackBy: trackById"
          [todo]="todo"
          [isEditing]="isEditing(todo.id)"
          (editStart)="onEditStart(todo.id)"
          (updateTodo)="onUpdateTodo(todo.id, $event)"
          (editCancel)="onCancelEdit()"
          (deleteTodo)="onDeleteTodo($event)"
        ></todo-item>
      </div>
    </section>
  `,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  standalone: true
})
export class TodoContainerComponent {
  private todoService = inject(TodoDataService);

  // Use sorted todos for display
  todos = this.todoService.getSortedTodos();

  // Track which todo is being edited
  editingId: string | null = null;

  onAddTodo(event: AddTodoEvent) {
    this.todoService.addTodo(event.description, event.priority, event.dueDate);
  }

  onEditStart(todoId: string) {
    this.editingId = todoId;
  }

  onUpdateTodo(todoId: string, updates: { description: string; priority: number; dueDate: string | null }) {
    try {
      this.todoService.updateTodo(todoId, updates);
      this.editingId = null; // Exit edit mode on successful update
    } catch (error) {
      console.error('Failed to update todo:', error);
      // Keep in edit mode if update failed
    }
  }

  onCancelEdit() {
    this.editingId = null;
  }

  isEditing(todoId: string): boolean {
    return this.editingId === todoId;
  }

  onDeleteTodo(todoId: string) {
    this.todoService.removeTodo(todoId);
  }

  trackById(index: number, todo: any): string {
    return todo.id;
  }
}