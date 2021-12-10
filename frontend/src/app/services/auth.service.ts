import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  username: string,
  key: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: Make it pull current user from cookies.
  currentUser = new BehaviorSubject<User | undefined> (undefined)

  constructor() { }
}
