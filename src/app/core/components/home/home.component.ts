import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menu: string ='';
  constructor(private authService: AuthService)
  {

  }
  logout(){
    this.authService.logout();
  }
}
