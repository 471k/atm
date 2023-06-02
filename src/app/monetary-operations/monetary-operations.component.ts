import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'monetary-operations',
  templateUrl: './monetary-operations.component.html',
  styleUrls: ['./monetary-operations.component.css']
})
export class MonetaryOperationsComponent {
  @Output('operationSelected1') operationSelected = new EventEmitter<number>();  
  @Input('title') title: string = '';

  performOperation(button: MatButton)
  {
    const amount = parseInt(button._elementRef.nativeElement.value, 10)
    this.operationSelected.emit(amount);
  }
}
