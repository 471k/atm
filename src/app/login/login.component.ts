import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  menu: string = ''
  credentials: any = {};

  constructor(
    // private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  async submit(form: any) {
    // if (this.validate(form)) {
      let user = await this.authService.login(this.credentials);
      if (user) this.router.navigate(['/dashboard']);
    // }
  }

  // validate(form: any) {
  //   console.log('form: ', form);

  //   if (form.controls.cardNr.touched && form.controls.cardNr.invalid) {
  //     this.openSnackBar('Enter a valid card number');
  //     return false;
  //   }

  //   if (form.controls.pin.touched && form.controls.pin.invalid) {
  //     this.openSnackBar('Pin is required');
  //     return false;
  //   }

  //   if (!form.value.cardNr || !form.value.pin) {
  //     this.openSnackBar('Enter credentials');
  //     return false;
  //   }

  //   return true;
  // }

  // openSnackBar(message: string) {
  //   this.snackBar.open(message, 'OK', { duration: 5000 });
  // }
}
