import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number,
  username: string,
  customerId: string
  key: string,
  nfts: number[]
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
      id: 0,
      username: "Joseph",
      key: "12345",
      customerId: "cus_000",
      nfts: []
    })
  }

  logOut() {
    this.currentUser.next(null)
  }
}
