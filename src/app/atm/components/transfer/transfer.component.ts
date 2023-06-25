import { _isNumberValue } from '@angular/cdk/coercion';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent {
  menu: string = "Transfer";
  constructor( private router: Router ) { }

  transfer(amount: number){
    this.router.navigate(['/make-transfer', amount]);
  }
}
