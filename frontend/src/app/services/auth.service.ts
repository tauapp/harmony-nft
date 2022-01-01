import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

  async loginWithGoogle() {
    //Dummy user data
    this.currentUser.next({
      id: 0,
      username: "Joseph",
      key: "12345",
      customerId: "cus_000",
      nfts: []
    })

    //Redirect to home
    this.router.navigate(['/home'])
  }

  logOut() {
    this.currentUser.next(null)
  }
}
