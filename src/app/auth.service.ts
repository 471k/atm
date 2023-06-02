import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import * as firebaseAuth from 'firebase/auth';

import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<firebase.User | null>;
  suffix = '@atm.com';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = afAuth.authState;
  }

  login(credentials: any) {
    credentials.cardNumber += this.suffix;
    
    return this.afAuth.signInWithEmailAndPassword(
      credentials.cardNumber,
      credentials.pin
    );
  }

  getCurrentUser() {
    return firebaseAuth.getAuth().currentUser;
  }

  getUser() {
    return this.afAuth.currentUser;
  }

  logout() {
    this.afAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  signup(registrationForm: any) {
    
    registrationForm.cardNumber += this.suffix;

    this.afAuth.createUserWithEmailAndPassword(
      registrationForm.cardNumber,
      registrationForm.pin
    );
  }
}
