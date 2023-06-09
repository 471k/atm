import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  menu: string ='Admin cPanel';
  constructor( private authService: AuthService ){ }

  logout()
  {
    this.authService.logout();
  }
  
}
