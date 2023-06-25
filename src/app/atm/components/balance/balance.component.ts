import { AuthService } from '../../../shared/services/auth.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Account } from '../../../shared/models/account';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent {
  menu: string = 'Balance';
  account!: Account;

  constructor(
    private afAuth: AngularFireAuth,
    private accountService: AccountService,
    private authService: AuthService
  ){
    // this.currentUser = firebase.getAuth().currentUser;
    // console.log(this.currentUser);

    this.afAuth.authState.subscribe(user =>{
      if(user){
        console.log("this");
        console.log(user);

         this.accountService.getAccountByUserId(user.uid).subscribe((user: any) => {
          this.account = user;
          // this.user= user.cardNumber
          // this.user.push( user)
          console.log(user)
         });
      }
      else
      {
        console.log("that");        
      }
    });
  }
  
}
