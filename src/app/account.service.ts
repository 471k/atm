import { TransferAccounts } from './transfer-accounts';
import { BalanceComponent } from './balance/balance.component';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Account } from './account';
import { take } from 'rxjs/internal/operators/take';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { AuthService } from './auth.service';
import { Pin } from './pin';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit{
  balance!: number;
  account!: Account;
  currentUser$: Observable<firebase.User | any>;
  getPin: Pin = {
    pin: {
      currentPin: '',
      newPin: '',
    },
  };

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.currentUser$ = afAuth.authState;
  }

  ngOnInit(){  
  }

  createAccount(data: any) {
    this.db.object('/users/' + data.uid).update({
      cardNumber: data.cardNumber,
      balance: data.balance,
      fullname: data.fullname,
      uid: data.uid,
    });
  }

  getAccountByUserId(uid: string | undefined): Observable<any> {
    return this.db.object('/users/' + uid).valueChanges();
  }

  withdraw(account: Account, inputAmount: number) {
    this.updateAccount(account.uid, -inputAmount, 'Withdrawal');
  }

  deposit(account: Account, inputAmount: number) {
    this.updateAccount(account.uid, inputAmount, 'Deposit');
  }

  updateAccount(uid: string, inputAmount: number, transactionType: string) {
    const transactionId = this.db.createPushId();

    // fetch the current user's data including the existing transactions
    this.db
      .object('/users/' + uid)
      .valueChanges()
      .pipe(take(1))
      .subscribe((userData: any) => {
        const currentTransactions = userData.transactions || {}; // Get the existing transactions or an empty object if none exists

        // calculate the new balance
        const newBalance = userData.balance + inputAmount;

        // add the new transaction to the existing transaction data
        const updatedTransactions = {
          ...currentTransactions,
          [transactionId]: {
            type: transactionType,
            amount: inputAmount,
            timestamp: Date.now(),
          },
        };

        // Update the balance and transactions in the database
        this.db.object('/users/' + uid).update({
          balance: newBalance,
          transactions: updatedTransactions,
        });
      });
  }

  changePin() {
    let currentuser = this.authService.user$;
    let email: any;

    currentuser.subscribe((cu) => {
      email = cu?.email;

      if (cu && this.getPin.pin) {
        const credential = firebase.EmailAuthProvider.credential(
          email,
          this.getPin.pin.currentPin
        );
        cu?.reauthenticateWithCredential(credential)
          .then(() => {
            cu.updatePassword(this.getPin.pin.newPin)
              .then(() => {
                console.log('Password changed successfully!');
              })
              .catch((error) => {
                console.error('Error updating password: ', error);
              });
          })
          .catch((error) => {
            console.error('Error reauthenticating user:', error);
          });
      }
    });
  }

  getStatement(user: firebaseAuth.User | null) {
    return this.db
      .object('/users/' + user?.uid + '/transactions')
      .snapshotChanges();
  }

  getReceiverAccount(inputCardNumber: string) {
    return this.db
      .list('/users/', (ref) =>
        ref.orderByChild('cardNumber').equalTo(inputCardNumber)
      )
      .valueChanges();
  }

  
 makeTransferFrom(transferAccounts: TransferAccounts) 
  {

    console.log('from this.transferAccounts: ', transferAccounts)
    
    const faTransactionId = this.db.createPushId();

    //fetch current user's data including existing transactions for the user
    this.db.object('/users/'+transferAccounts.fromAccountUid)
    .valueChanges()
    .pipe(take(1))
    .subscribe((faUserData: any) =>
    {
      //get the existing transaction or an empty object
      const faCurrentTransaction = faUserData.transactions || {};
      
      // calculate the new balance
      const faNewBalance = faUserData.balance - transferAccounts.amount ;

      //add the new transaction to the existing transaction data
      const faUpdatedTransactions = {
        ...faCurrentTransaction,
        [faTransactionId]:{
          type: 'Transfer',
          amount: -transferAccounts.amount,
          to: transferAccounts.toCardNumber,
          timestamp: Date.now()
        },
      };

      // update the balance and transactions in the database
        this.db.object('/users/'+transferAccounts.fromAccountUid).update({
        balance: faNewBalance,
        transactions: faUpdatedTransactions
      })
    }
    );
      
  }

  makeTransferTo(transferAccounts: TransferAccounts)
  {
    console.log('to this.transferAccounts: ', transferAccounts);
    

    const taTransactionId = this.db.createPushId();
    
    // fetch users data
    this.db.object('/users/' + transferAccounts.toAccountUid)
    .valueChanges()
    .pipe(take(1))
    .subscribe((taUserData: any) =>{
      //get existing transaction or an empty object
      const taCurrentTransaction = taUserData.transactions || {};
      
      //calculate the new balance
      const taNewBalance = taUserData.balance + transferAccounts.amount;
      
      //add the new transaction to the existing transaction data
      const taUpdatedTransactions = {
        ...taCurrentTransaction,
        [taTransactionId]:{
          type: 'Transfer',
          amount: transferAccounts.amount,
          from: transferAccounts.fromCardNumber,
          timestamp: Date.now()
        },
      }

      //update the balance and transactions in the database
        this.db.object('/users/'+transferAccounts.toAccountUid).update({
        balance: taNewBalance,
        transactions: taUpdatedTransactions
      });
    });
  }



}
