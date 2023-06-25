import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Component, Input, OnInit } from '@angular/core';
import { Account } from '../../../shared/models/account';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-make-deposit',
  templateUrl: './make-deposit.component.html',
  styleUrls: ['./make-deposit.component.css']
})
export class MakeDepositComponent implements OnInit{
  @Input('amount') inputAmount!: any;
  @Input('isAmountSet') isAmountSet: boolean = false;
  account!: Account;
  menu: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog)
  { }

  // ngOnInit(){
      
  //   this.route.params.subscribe(res =>{      
  //     this.inputAmount = Number(res?.['amount']);
  //     this.isAmountSet = (this.inputAmount === 0)?false:true;
  //   })
  
  //   this.afAuth.authState.subscribe(user=>{
  //     this.accountService.getAccountByUserId(user?.uid).subscribe(account => {
  //       this.account = account;
  //     });
  //   });

  // }

  /**
   * the route.params observable is piped through the switchMap operator to 
   * handle the parameter extraction and assignment. Next, the afAuth.authState 
   * observable is piped through another switchMap operator to fetch the account 
   * details using accountService.getAccountByUserId(). The final result is then 
   * subscribed to update the account property.
   * 
   * By using switchMap, we eliminate the need for nested subscriptions and make the 
   * code more concise and readable. Additionally, the use of async pipe in the template 
   * can simplify the data binding process.
   */

  ngOnInit() {
    this.route.params.pipe(
      switchMap(res => {
        this.inputAmount = Number(res?.['amount']);
        this.isAmountSet = (this.inputAmount === 0) ? false : true;
        return this.afAuth.authState;
      }),
      switchMap(user => this.accountService.getAccountByUserId(user?.uid))
    ).subscribe(account => {
      this.account = account;
    });
  }

  deposit(form: any)
  {
    let dialogres = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px'
    })

    dialogres.afterClosed().subscribe((answer) =>
    {
      if(answer === 'yes')
      {
        this.inputAmount = form.amountInput;
    
        this.accountService.deposit(this.account, this.inputAmount);
        this.router.navigate(['/dashboard']);
      }
    })

    
  }


}
