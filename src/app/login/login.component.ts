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

  async submit(form: any) 
  {
    let user = await this.authService.login(form);
    if (user) this.router.navigate(['/dashboard']);
  }
}
