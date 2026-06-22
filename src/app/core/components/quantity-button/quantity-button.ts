import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { single } from 'rxjs';

@Component({
  selector: 'app-quantity-button',
  imports: [],
  templateUrl: './quantity-button.html',
  styleUrl: './quantity-button.css',
})
export class QuantityButton implements OnInit {
  QuantityNumer = signal(1);
  @Output() changedQantity = new EventEmitter<number>();
  @Input() starterQuantity: number = 1;

  ngOnInit() {
    this.QuantityNumer.set(this.starterQuantity);
  }

  updateNumber(newNumber: number) {
    this.QuantityNumer.set( Math.max(this.QuantityNumer() + newNumber, 1) );
    this.changedQantity.emit(this.QuantityNumer());
  }

}
