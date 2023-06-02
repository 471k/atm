import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input('menu') menu: string = '';
  logo: string = '../assets/bni_life.png';

  currentUser: any;
  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    accountService
      .getAccountByUserId(this.currentUser?.uid)
      .subscribe((result: any) => {
        console.log('result: ', result);
      });
  }
}
