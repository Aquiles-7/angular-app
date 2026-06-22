import { Component } from '@angular/core';
import { CategoryComponent } from '../../core/components/category-component/category-component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoryComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
