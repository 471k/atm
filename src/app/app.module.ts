import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from  '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { DashboardComponent } from './atm/components/dashboard/dashboard.component';
import { BalanceComponent } from './atm/components/balance/balance.component';
import { WithdrawalComponent } from './atm/components/withdrawal/withdrawal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';


import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './shared/services/auth.service';
import { SignupComponent } from './core/components/signup/signup.component';
import { UserService } from './shared/services/user.service';
import { WithdrawComponent } from './atm/components/withdraw/withdraw.component';
import { AccountService } from './shared/services/account.service';
import { DepositComponent } from './atm/components/deposit/deposit.component';
import { MakeDepositComponent } from './atm/components/make-deposit/make-deposit.component';
import { MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChangePinComponent } from './atm/components/change-pin/change-pin.component';
import { StatementComponent } from './atm/components/statement/statement.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TransferComponent } from './atm/components/transfer/transfer.component';
import { MakeTransferComponent } from './atm/components/make-transfer/make-transfer.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { MonetaryOperationsComponent } from './shared/components/monetary-operations/monetary-operations.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { TransactionsComponent } from './admin/components/transactions/transactions.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    BalanceComponent,
    WithdrawalComponent,
    SignupComponent,
    WithdrawComponent,
    DepositComponent,
    MakeDepositComponent,
    ConfirmationDialogComponent,
    ChangePinComponent,
    StatementComponent,
    TransferComponent,
    MakeTransferComponent,
    MonetaryOperationsComponent,
    HeaderComponent,
    AdminDashboardComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    // AngularFireAuthModule,
    BrowserAnimationsModule,
    FormsModule,    
    //Material modules
    MatDialogModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ScrollingModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatListModule,

    //routing
    RouterModule.forRoot([
      { 
        path: '', 
        component: HomeComponent 
      },
      { 
        path: 'withdraw/:amount', 
        component: WithdrawComponent ,
        canActivate: [AuthGuard]
      },
      {
        path: 'make-deposit/:amount',
        component: MakeDepositComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'make-transfer/:amount',
        component: MakeTransferComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'login', 
        component: LoginComponent
      },
      { 
        path: 'signup', 
        component: SignupComponent 
      },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'balance', 
        component: BalanceComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'deposit', 
        component: DepositComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'withdrawal', 
        component: WithdrawalComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'changepin',
        component: ChangePinComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statement',
        component: StatementComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transfer',
        component: TransferComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      }
    ])
  ],
  providers: [
    AuthService,
    UserService,
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
