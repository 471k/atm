import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  menu: string = ''
  credentials: any = {};
  isAdmin: Promise<boolean> | undefined;

  constructor(
    // private snackBar: MatSnackBar,
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  async submit(form: any) 
  {
    let user = await this.authService.login(form);
    if (user) 
    {
      let uid = user.user?.uid;
      console.log('user uid: ', user.user?.uid);


      this.accountService.getAccountByUserId(uid).subscribe((result: any) =>
      {
        console.log("isadmin result: ", result);
        if(result.isAdmin)
        {
          this.router.navigate(['/admin-dashboard'])
        }
        else
        {
          this.router.navigate(['/dashboard']);
        }
      })

      
    }
  }

  async getUserType(uid: string | undefined): Promise<boolean> {
    const result = await this.accountService.getAccountByUserId(uid).toPromise();
    console.log('getUserType result.isAdmin:', result.isAdmin);

    return result.isAdmin;
  }
  
}
