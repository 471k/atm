import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { Pin } from '../pin';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.css']
})
export class ChangePinComponent {
  menu: string = "Change Pin";
  storePin: Pin ={
    pin: {
      currentPin: '', 
      newPin:''
    }
  };

  constructor(private accountService: AccountService){ }

  submit(form: any)
  {
    this.storePin.pin.currentPin = form.currentPin;
    this.storePin.pin.newPin = form.newPin;

    this.accountService.changePin();
  }
}