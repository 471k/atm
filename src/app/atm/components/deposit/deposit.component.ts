import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  menu: string = "Deposit";
  constructor( private router: Router ){}

  deposit(amount: number)
  {
    this.router.navigate(['/make-deposit', amount]);
  }
}
