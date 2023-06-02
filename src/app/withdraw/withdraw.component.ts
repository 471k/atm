import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs/internal/Observable';
import { Account } from '../account';
import { ActivatedRoute, Router } from '@angular/router';
import { _isNumberValue } from '@angular/cdk/coercion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  @Input('balance') balance!: Observable<any>;
  @Input('amount') inputAmount!: any;
  @Input('isAmountSet') isAmountSet: boolean = false;
  account!: Account;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.inputAmount = Number(res?.['amount']);
      this.isAmountSet = this.inputAmount === 0 ? false : true;
    });

    this.afAuth.authState.subscribe((user) => {
      this.accountService.getAccountByUserId(user?.uid).subscribe((account) => {
        this.account = account;
      });
    });
  }

  withdraw(form: any) {
    // let dialogres: MatDialogRef<any>;

    if(this.inputAmount <=this.account.balance)
    {
      let dialogres = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
      });
  
      dialogres.afterClosed().subscribe((answer) => {
        console.log(answer);
  
        if (answer === 'yes') {
          this.inputAmount = form.amountInput;
  
          // this.account.balance -= this.amount;
          // this.accountService.withdraw(this.account.uid, this.amount);
          this.accountService.withdraw(this.account, this.inputAmount);
          this.router.navigate(['/dashboard']);
        }
      });
    }
    else {
      console.log('Insufficient funds!');
    }
    

     
  }
}
