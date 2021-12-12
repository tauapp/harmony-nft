import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  email: string,
  username: string,
  key: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: Make it pull current user from cookies.
  currentUser = new BehaviorSubject<User | null> (null)

  constructor() { }

  async loginWithGoogle() {
    //Dummy user data
    this.currentUser.next({
      email: "joseph@marcello.ama",
      username: "Joseph",
      key: "12345"
    })
  }

  logOut() {
    this.currentUser.next(null)
  }
}
