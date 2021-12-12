import { Component } from '@angular/core';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  currentUser: User | null = null

  ngOnInit() {
    this.auth.currentUser.subscribe((user) => {
      this.currentUser = user
    })
  }
}
