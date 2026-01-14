import { Component, inject } from '@angular/core';
import { TodoDataService } from '../../services/todo-data.service';
import { TodoFormComponent, AddTodoEvent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';

@Component({
  selector: 'todo-container',
  template: `
    <section class="p-6 max-w-2xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
        <p class="text-gray-600">Manage your weekly tasks with priorities and due dates</p>
      </header>

      <todo-form (addTodo)="onAddTodo($event)" class="mb-8"></todo-form>

      <todo-list [todos]="todos()"></todo-list>
    </section>
  `,
  imports: [TodoFormComponent, TodoListComponent],
  standalone: true
})
export class TodoContainerComponent {
  private todoService = inject(TodoDataService);

  // Use sorted todos for display
  todos = this.todoService.getSortedTodos();

  onAddTodo(event: AddTodoEvent) {
    this.todoService.addTodo(event.description, event.priority, event.dueDate);
  }
}