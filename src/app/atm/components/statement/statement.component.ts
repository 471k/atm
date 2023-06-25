import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../shared/services/account.service';
import { Account } from '../../../shared/models/account';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as firebaseAuth from 'firebase/auth';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css'],
})
export class StatementComponent implements OnInit {
  menu: string = 'Statement';
  account: Account = {
    balance: 0,
    cardNumber: '',
    fullName: '',
    uid: '',
    transactions: {
      transactions: null,
    },
  };

  user: firebaseAuth.User | null;
  transactions: any[] = [];
  
  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.user = authService.getCurrentUser();
  }

  ngOnInit() {
    this.accountService
      .getStatement(this.user)
      .subscribe((transactions: any) => {
        this.transactions = Object.values(transactions.payload.val() || {});
      });
  }
}
