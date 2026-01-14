import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoContainerComponent } from './components/todo-container/todo-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('todo-app');
}
