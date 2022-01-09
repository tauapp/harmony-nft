import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import axios, { AxiosResponse } from 'axios'
import { environment } from 'src/environments/environment';
import { Result } from 'src/contracts/result';

export interface User {
  username: string,
  email: string,
  token: OatToken
}

export interface OatToken {
  type: string
  token: string
  expires_at?: string | undefined
  expires_in?: number | undefined
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
    let user = await this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID)
    let res = await axios.post(environment.server + "/auth/login", {
      email: user.email,
      name: user.name,
      token: user.id
    }) as AxiosResponse<OatToken>
    this.currentUser.next({
      username: user.name,
      email: user.email,
      token: res.data
    })

    this.cookies.set('user', JSON.stringify(this.currentUser.value))

    //Redirect to home
    this.router.navigate(['/home'])

  }

  logOut() {
    this.currentUser.next(null)
    this.cookies.delete('user')
  }

  link(id: string) {
    return axios.post(environment.server + "/auth/link",
    {
      customerId: id
    },
    {
      headers: {
        Authorization: "Bearer " + this.currentUser.value!.token.token
      }
    })
    .then(() => Result.Success)
    .catch(err => Result.Error(err.response.data.error))
  }

  async isLinked() {
    let res = await axios.post(environment.server + "/auth/isLinked",
    {
      headers: {
        Authorization: "Bearer " + this.currentUser.value!.token.token
      }
    }) as AxiosResponse<{isLinked: boolean}>
    return !!res.data.isLinked
  }
}
