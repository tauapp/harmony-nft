import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
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

  constructor(
    private router: Router,
    private socialAuth: SocialAuthService,
    private cookies: CookieService
    ) { 
      let user = this.cookies.get('user')
      if (user) {
        this.currentUser.next(JSON.parse(user))
      }
    }

  async loginWithGoogle() {
    //Dummy user data
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.currentUser.next({
        id: 0,
        username: user.name,
        customerId: '',
        key: user.id,
        nfts: []
      })

      this.cookies.set('user', JSON.stringify(this.currentUser.value))

      //Redirect to home
      this.router.navigate(['/home'])
    })

  }

  logOut() {
    this.currentUser.next(null)
    this.cookies.delete('user')
  }

  link(id: string) {
    this.currentUser.value!.customerId = id
  }

  isLinked() {
    return this.currentUser.value!.customerId != ''
  }
}
