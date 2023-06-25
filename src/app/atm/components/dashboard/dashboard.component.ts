import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { AccountService } from '../../../shared/services/account.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menu: string ='';
  constructor( private authService: AuthService ){ }

  logout()
  {
    this.authService.logout();
  }
  
}
