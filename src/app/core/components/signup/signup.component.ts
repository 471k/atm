import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../shared/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  menu: string = 'Sign Up';
  users: any;
  registration: any = {};

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  signup(registrationForm: any) 
  {
    this.authService.signup(registrationForm);

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        registrationForm.uid = user.uid;
        this.accountService.createAccount(registrationForm);
        this.router.navigate(['/dashboard']);
      } else {
        console.log('that');
      }
    });
  }
}
