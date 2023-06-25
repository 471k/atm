import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppUser } from '../models/app-user';
import { AngularFireDatabase } from '@angular/fire/compat/database';


import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  save(user: firebase.User)
  {
    this.db.object(`/users/${user.uid}`).update({
      cardNr: user.email
    });
  }

  get(uid: string ): Observable<AppUser | unknown>
  {
    return this.db.object('/users/' + uid).valueChanges();
  }
}
