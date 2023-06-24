import { TransferAccounts } from './transfer-accounts';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs/internal/Observable';
import { Account } from './account';
import { take } from 'rxjs/internal/operators/take';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { AuthService } from './auth.service';
import { Pin } from './pin';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs';

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

  getAccountByCardNr(inputCardNumber: string) {
    return this.db
      .list('/users/', (ref) =>
        ref.orderByChild('cardNumber').equalTo(inputCardNumber)
      )
      .valueChanges();
  }

  makeTransferFrom(transferAccounts: TransferAccounts) {
    this.makeTransfer(transferAccounts, 'subtract', 'from');
  }
  
  makeTransferTo(transferAccounts: TransferAccounts) {
    this.makeTransfer(transferAccounts, 'add', 'to');
  }
  
  makeTransfer(transferAccounts: TransferAccounts, amountType: string, transactionType: string) {
    console.log('this.transferAccounts: ', transferAccounts);
    const recordId = this.db.createPushId();
    
    let dbPath: string;
    

    if(transactionType === 'to')
      dbPath = '/users/' + transferAccounts.toAccountUid;
    else{
      dbPath = '/users/' + transferAccounts.fromAccountUid;
    }
    
    this.db.object(dbPath)
      .valueChanges()
      .pipe(take(1))
      .subscribe((userData: any) => {
        const currentTransaction = userData.transactions || {};
        const newBalance = amountType == 'add' ? userData.balance + transferAccounts.amount : userData.balance - transferAccounts.amount;
        
        const updatedTransactions = {
          ...currentTransaction,
          [recordId]: {
            type: 'Transfer',
            amount: amountType == 'add' ? transferAccounts.amount : -transferAccounts.amount,
            sender: transferAccounts.fromCardNumber,
            receiver: transferAccounts.toCardNumber,
            transactionId: transferAccounts.transactionId,
            timestamp: Date.now()
          }
        };
        
        this.db.object(dbPath).update({
          balance: newBalance,
          transactions: updatedTransactions
        });

      });
  }

  updateTransactions(transferAccounts: TransferAccounts)
  {

    
    let dbPathT: string;
    
    dbPathT = '/transactions/';
    
    const recordId = this.db.createPushId();
    
    
    this.db.object(dbPathT).update({
      [recordId]: {
        type: 'Transfer',
        amount: transferAccounts.amount,
        sender: transferAccounts.fromCardNumber,
        receiver: transferAccounts.toCardNumber,
        timestamp: Date.now()            
      }
    });
  }



  getTransactions(): Observable<any[]> 
  {
    return this.db.list('/transactions').snapshotChanges().pipe(
      map((transactions) => {
        // console.log('transactions11: ', transactions);
        // Combine all the transactions from all the users into one object
        let transactionsObj: any = {};

        transactions.forEach((transaction) => {
          // console.log('transaction: ', transaction);
          
          if (transaction.payload.exists()) 
          {
            let key: any = transaction.payload.key;
            let data: any = transaction.payload.val();
            // console.log('key: ', key);
            // console.log('data: ', data);

            let type = data.type;
            // console.log('type: ', type);
            if(type === 'Transfer') 
            {
              // console.log("if type transfer: ", data);
              data['transactionId'] = key;
              transactionsObj[key] = data;
            }
          }
        });
        return transactionsObj;
      })
    );
  }



  /**
   * 
   * This code defines an `async` function named `revertTransactions` that accepts an array of 
   * `selectedTransactions` as its parameter. The function iterates over each element of the array 
   * and executes the following steps:
   * 
   * 1. Get the sender's account details by calling `getAccountByCardNr` method with the sender's card 
   * number as its parameter. This method returns an observable that is converted to a promise 
   * using `toPromise()` method. The `take(1)` operator ensures that the observable completes after 
   * emitting the first value. The account details are stored in the `senderAccount` variable.
   * 
   * 2. Get the receiver's account details using the same method as in step 1, but with the receiver's 
   * card number as its parameter. The account details are stored in the `receiverAccount` variable.
   * 
   * 3. Call the `updateBalance` function with the sender's user ID, receiver's user ID, and transaction 
   * amount as its parameter. This function updates the sender's and receiver's balance by subtracting and 
   * adding the transaction amount respectively.
   */
/*async revertTransactions(selectedTransactions: any[])
{

  console.log("selectedTransactions.length: ", selectedTransactions.length);

  for (let i = 0; i < selectedTransactions.length; i++)
  {
    const selectedRow = selectedTransactions[i];
    const senderAccount: any = await this.getAccountByCardNr(selectedRow.sender).pipe(take(1)).toPromise();
    const receiverAccount: any = await this.getAccountByCardNr(selectedRow.receiver).pipe(take(1)).toPromise();
    
    await this.updateBalance(senderAccount[0].uid, receiverAccount[0].uid, selectedRow.amount);
    // console.log('selectedRow.transactionId: ', selectedRow.transactionId);
    
    await this.deleteTransaction(selectedRow.transactionId);
  }
}*/

async revertTransactions(selectedTransactions: any[]) {
  console.log("selectedTransactions.length: ", selectedTransactions.length);
  let totalAmount = 0;
  for (let i = 0; i < selectedTransactions.length; i++) {
    const selectedRow = selectedTransactions[i];
    totalAmount += selectedRow.amount;
    await this.deleteTransaction(selectedRow.transactionId);
  }
  const senderAccount: any = await this.getAccountByCardNr(selectedTransactions[0].sender).pipe(take(1)).toPromise();
  const receiverAccount: any = await this.getAccountByCardNr(selectedTransactions[0].receiver).pipe(take(1)).toPromise();
  await this.updateBalance(senderAccount[0].uid, receiverAccount[0].uid, totalAmount);
}



async deleteTransaction(transactionId: string)
{
  await this.db.object('/transactions/' + transactionId).remove();
}

/**
 * The `updateBalance` function gets called within the `revertTransactions` function. This function takes 
 * three parameters: `senderUid`, `receiverUid`, and `amount`. The function does the following:
 * 
 * 1. Get the sender's data and receiver's data from the Firebase Realtime Database.
 * 
 * 2. Calculate the new balance of the sender and the receiver by subtracting and adding the transaction 
 * amount respectively.
 * 
 * 3. Update the sender's and receiver's balance in the Firebase Realtime Database using the `update` method 
 * of the `DatabaseObject` instance returned by `this.db.object('/users/' + senderUid)` and 
 * `this.db.object('/users/' + receiverUid)`.
 * 
 * The `async/await` keywords are used to make the function wait for asynchronous operations to complete 
 * before continuing with the next step.
 * 
 * @param senderUid 
 * @param receiverUid 
 * @param amount 
 */
async updateBalance(senderUid: string, receiverUid: string, amount: number)
{
  const [senderData, receiverData]: any = await Promise.all([
    this.db.object('/users/' + senderUid).valueChanges().pipe(take(1)).toPromise(),
    this.db.object('/users/' + receiverUid).valueChanges().pipe(take(1)).toPromise()
  ]);

  const newSenderBalance = senderData.balance + amount;
  const newReceiverBalance = receiverData.balance - amount;

  await Promise.all([
    this.db.object('/users/' + senderUid).update({ balance: newSenderBalance }),
    this.db.object('/users/' + receiverUid).update({ balance: newReceiverBalance })
  ]);
}

}
