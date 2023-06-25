// import { TransferAccounts } from './../transfer-accounts';
import { Component, Input, OnInit } from '@angular/core';
import { Account } from '../../../shared/models/account';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, switchMap, take } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import { TransferAccounts } from '../../../shared/models/transfer-accounts';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.component.css'],
})
export class MakeTransferComponent implements OnInit {
  @Input('amount') inputAmount!: number;
  @Input('cardNumber') toAccountCardNumber!: string;
  @Input('toAccountUid') toAccountUid!: string;
  @Input('fromAccount') fromAccount!: string;
  @Input('isAmountSet') isAmountSet: boolean = false;
  isAccountFound: boolean = true;

  transferAccounts: TransferAccounts = {
    fromAccountUid: '',
    toAccountUid: '',
    fromCardNumber: '',
    toCardNumber: '',
    amount: 0,
    transactionId: ''
  };

  account!: Account;
  accountData$: any;
  suffix = '@atm.com';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {
    this.route.params
      .pipe(
        switchMap((res) => {
          console.log("res?.['amount']: ", res?.['amount']);
          this.inputAmount = Number(res?.['amount']);
          this.isAmountSet = this.inputAmount === 0 ? false : true;
          return this.afAuth.authState;
        }),
        switchMap((user) => this.accountService.getAccountByUserId(user?.uid))
      )
      .subscribe((account) => (this.account = account));
  }

  ngOnInit() {}


  async transfer(form: any) {
    try {
      console.log('form: ', form);
      await this.getToAccountUid(form.cardNumberInput);
      const { cardNumber, uid, balance } = this.account;
      const { cardNumberInput } = form;
      const toCardNumber = `${cardNumberInput}${this.suffix}`;
      const transactionId = this.db.createPushId()


      this.transferAccounts.fromCardNumber = this.account.cardNumber;
      this.transferAccounts.toCardNumber = form.cardNumberInput + this.suffix;
      this.transferAccounts.fromAccountUid = this.account.uid;
      this.transferAccounts.amount = this.inputAmount;
      this.transferAccounts.transactionId = transactionId;

      

      if (this.transferAccounts.toAccountUid === 'not-found' || !this.transferAccounts.toAccountUid) {
        console.log('No account was found');
        this.isAccountFound = false;
        return;
      }
      
      if (!this.isWithinBalance(this.inputAmount, balance)) {
        console.log('Insufficient funds!');
        return;
      }
      
      const dialogRes = await this.dialog.open(ConfirmationDialogComponent, { width: '250px' }).afterClosed().toPromise();
      
      if (dialogRes === 'yes') {
        await Promise.all([
          this.accountService.makeTransferFrom(this.transferAccounts),
          this.accountService.makeTransferTo(this.transferAccounts),
          this.accountService.updateTransactions(this.transferAccounts),
        ]);
        
        this.router.navigate(['/dashboard']);
      }
    } catch(e) {
      console.error(e);
      // handle error
    }
  }
  
  
  async getToAccountUid(toAccountCardNumber: string) {
    toAccountCardNumber += this.suffix;
    let res: string = '';
    console.log("getToAccountUid was called");
    
    try {
      const data: any = await this.accountService.getAccountByCardNr(toAccountCardNumber).pipe(take(1)).toPromise();
      
      if (data.length === 0) {
        this.transferAccounts.toAccountUid = 'not-found';
      } else {
        this.transferAccounts.toAccountUid = data[0].uid;
      }
    } catch (error) {
      console.log('Error getting account data:', error);
    }
  }
  


  isWithinBalance(inputAmount: number, senderBalance: number): boolean {
    if (inputAmount <= senderBalance) {
      return true;
    } else {
      return false;
    }
  }
}
