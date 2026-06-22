import { Component, signal } from '@angular/core';
import { RouterOutlet , RouterLink } from '@angular/router';
import { Tabs } from './core/interface/tabs/tabs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tabs ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-app');
}
