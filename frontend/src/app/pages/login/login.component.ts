import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  googleLogo = faGoogle

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  async logIn() {
    await this.auth.loginWithGoogle();
  }

}
