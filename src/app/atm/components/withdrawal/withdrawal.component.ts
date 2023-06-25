import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent {
  menu: string = "Withdrawal";
  constructor( private router: Router ){}

  withdraw(amount: number){
    this.router.navigate(['/withdraw', amount]);
  }
}
